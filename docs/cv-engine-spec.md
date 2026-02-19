# Web CV Engine — Project Specification

## 1. Project Summary

Build a brand-new browser computer-vision engine with:

- **Primary backend:** WebGPU (default path)
- **Fallback backend:** WebGL2
- **Final fallback:** CPU/WASM

The project goal is OpenCV-like primitives for image/video processing in the browser, with predictable performance and a stable API.

## 2. Scope and Non-Goals

### In Scope (v1)

- File/image decode pipeline
- Core `Mat` memory model
- WebGPU runtime (buffers, compute pipelines, command execution)
- WebGL runtime (textures, framebuffers, shader execution)
- CPU fallback runtime
- Initial operator set:
  - `resize`
  - `cvtColor` (RGB/BGR/GRAY)
  - `normalize`
  - `gaussianBlur`
  - `threshold`
  - `sobel`
- Deterministic testing + benchmark harness

### Out of Scope (v1)

- Full OpenCV parity
- Video codec stack implementation
- DNN inference framework
- GPU-accelerated advanced CV features beyond the v1 operator set

## 3. Design Principles

1. **WebGPU-first execution:** use compute by default where supported.
2. **Backend abstraction:** no API surface tied to any backend specifics.
3. **Zero unnecessary copies:** avoid GPU↔CPU readbacks unless requested.
4. **Composable ops:** pipeline-friendly operation graph.
5. **Predictable resource lifecycle:** explicit allocation/disposal.

## 4. Architecture

## 4.1 Layers

1. **Public API Layer**
   - OpenCV-like user API (`Mat`, `resize`, `cvtColor`, etc.)
2. **Execution Layer**
   - Op dispatch, graph execution, backend selection
3. **Backend Layer**
   - `WebGPUBackend`, `WebGLBackend`, `CpuBackend`
4. **Resource Layer**
   - Buffer/texture pools, allocators, lifecycle tracking
5. **I/O Layer**
   - File decode, image encode, optional video frame adapters

## 4.2 Core Types

- `Mat`
  - `width`, `height`, `channels`, `dtype`, `stride`, `colorSpace`
  - `backend`: `cpu | webgl | webgpu`
  - `storageHandle`: typed array, texture handle, or gpu buffer
  - `dispose()`

- `Tensor`
  - `shape` with layout metadata (`NCHW` or `NHWC`)
  - `dtype`: `u8 | f16 | f32 | i32`
  - `backend`: `cpu | webgl | webgpu`
  - `storageHandle`: same abstraction family as `Mat`
  - `dispose()`

- `OpContext`
  - backend capability and runtime handles

- `KernelSpec`
  - op name, input/output types, backend implementations

### 4.4 ML-friendly data model requirements

The following are mandatory design constraints for this project:

1. **`Mat` and `Tensor` interoperability**
   - Shared storage abstraction and conversion without unnecessary copies.
2. **Explicit layout metadata**
   - `NCHW`/`NHWC` must be encoded in type metadata, never inferred implicitly.
3. **Explicit dtype tracking**
   - All buffers must carry explicit dtype (`u8`, `f16`, `f32`, `i32`) and backend kernels must validate compatibility.

## 4.3 Backend Contract

Every backend implements:

- `createMat(shape, dtype, channels)`
- `upload(input: ImageBitmap | Uint8Array | Float32Array): Mat`
- `download(mat: Mat): Promise<TypedArray>`
- `run(op: string, inputs: Mat[], params: object): Promise<Mat>`
- `dispose(mat: Mat): void`
- `supports(op: string): boolean`

## 5. Data and Memory Model

### 5.1 CPU Layout

- Interleaved channels by default (`RGBA`, `RGB`, `GRAY`)
- `Uint8Array` for most image ops, `Float32Array` for normalized/advanced ops

### 5.2 WebGL Layout

- Use textures for matrices
- Prefer `RGBA8` for compatibility
- Multi-channel packing strategy for non-RGBA formats
- Framebuffer-backed render passes

### 5.3 WebGPU Layout

- Use `GPUBuffer`/`GPUTexture` depending on operator needs
- WGSL compute kernels for image operations
- Reuse bind groups/pipelines where possible
- Minimize host/device transfers
### 5.4 Memory Rules

- Explicit `dispose()`
- Texture pool and framebuffer reuse
- Optional leak detector in dev mode

## 6. Decode and Encode Pipeline

## 6.1 Decode

- `File/Blob -> ImageBitmap` via `createImageBitmap`
- Optional worker decode path with `OffscreenCanvas`
- Normalize to internal `Mat` representation

## 6.2 Encode

- `Mat -> ImageBitmap -> Blob` output path
- PNG/JPEG initial support

## 7. Execution Model

### 7.1 Single-op path

- API call -> backend selector -> backend kernel run -> `Mat` result

### 7.2 Pipeline path

- Build operation graph
- Apply simple fusion opportunities (`cvtColor + normalize`, etc.)
- Avoid readback until explicitly requested

## 8. Operator Set (v1)

1. `resize` (nearest, bilinear)
2. `cvtColor` (RGB↔BGR, RGB→GRAY, BGR→GRAY)
3. `normalize` (scale/offset)
4. `gaussianBlur` (small kernels)
5. `threshold` (binary, inverse binary)
6. `sobel` (x, y, magnitude optional)

Each operator must have:

- WebGPU implementation
- WebGL implementation
- CPU fallback implementation
- Shared conformance tests

## 9. API Draft

```ts
type BackendPreference = "auto" | "webgl" | "cpu" | "webgpu";

interface EngineOptions {
  backend?: BackendPreference;
  debug?: boolean;
}

interface Mat {
  width: number;
  height: number;
  channels: 1 | 3 | 4;
  dtype: "u8" | "f32";
  backend: "cpu" | "webgl" | "webgpu";
  dispose(): void;
}

declare function createEngine(options?: EngineOptions): Promise<{
  fromFile(file: File): Promise<Mat>;
  toBlob(mat: Mat, mimeType?: "image/png" | "image/jpeg", quality?: number): Promise<Blob>;
  resize(src: Mat, width: number, height: number, mode?: "nearest" | "bilinear"): Promise<Mat>;
  cvtColor(src: Mat, code: "RGB2GRAY" | "BGR2GRAY" | "RGB2BGR"): Promise<Mat>;
  normalize(src: Mat, alpha: number, beta: number): Promise<Mat>;
  threshold(src: Mat, thresh: number, maxVal: number, mode: "binary" | "binary_inv"): Promise<Mat>;
  gaussianBlur(src: Mat, ksize: 3 | 5 | 7): Promise<Mat>;
  sobel(src: Mat, dx: 0 | 1, dy: 0 | 1): Promise<Mat>;
  dispose(): void;
}>;
```

## 10. Browser Compatibility

### v1 Support Target

- Chrome/Edge (modern stable)
- Firefox (modern stable)
- Safari (modern stable, WebGL constraints tested)

### Capability Strategy

- Detect WebGPU at startup and use as default
- Fallback to WebGL2 if WebGPU is unavailable
- Fallback to CPU/WASM if neither GPU backend is available

## 11. Testing Strategy

### 11.1 Correctness

- Golden image tests (input/output fixtures)
- Per-op tolerance thresholds
- Cross-backend parity tests (WebGPU vs WebGL vs CPU)

### 11.2 Performance

- Benchmark harness:
  - op latency (p50/p95)
  - memory footprint
  - throughput for fixed image sizes

### 11.3 Stability

- Resource leak tests
- Stress tests (repeated pipelines, rapid dispose/create)

## 12. Project Structure (new repository)

```text
cv-engine/
  src/
    api/
    core/
      mat/
      runtime/
      scheduler/
    backends/
      webgpu/
      webgl/
      cpu/
    ops/
      resize/
      cvtColor/
      normalize/
      threshold/
      gaussianBlur/
      sobel/
    io/
      decode/
      encode/
    utils/
  shaders/
  tests/
    fixtures/
    correctness/
    performance/
  examples/
  docs/
```

## 13. Delivery Plan

### Phase 0 — Foundation (1–2 weeks)

- Repository scaffolding
- `Mat` type and lifecycle
- backend contract
- WebGPU runtime bootstrap
- WebGL fallback runtime bootstrap
- decode/encode baseline

### Phase 1 — Core Ops (2–4 weeks)

- Implement v1 operator list
- CPU fallbacks
- correctness tests

### Phase 2 — Pipeline & Perf (2–3 weeks)

- graph execution
- pooling and fusion basics
- benchmark tooling

### Phase 3 — Hardening (1–2 weeks)

- browser compatibility pass
- API cleanup
- docs/examples

### Phase 4 — WebGPU optimization (optional)

- Add fusion and specialization for hot WebGPU kernels
- Compare optimized WebGPU against baseline WebGL path

## 14. Risks and Mitigations

- **WebGPU browser variance:** strict capability detection + WebGL fallback.
- **WebGL precision/format differences:** fixed test fixtures + per-browser validation.
- **Readback bottlenecks:** explicit delayed readback policy.
- **Memory leaks:** strict ownership model + dev leak checker.
- **API drift:** define and freeze v1 contracts before expanding ops.

## 15. Success Criteria

- Stable v1 API with documented operator behavior
- WebGPU backend passes all conformance tests where supported
- WebGL fallback passes all conformance tests
- CPU fallback functional for all v1 ops
- No significant leaks in stress tests
- Performance better than CPU-only baseline for target image sizes

## 16. Library Quality & Release Criteria

To ship this as a reliable public library, releases must satisfy the following gates.

### 16.1 API and Versioning

- Follow strict semantic versioning (`MAJOR.MINOR.PATCH`).
- Public API must be type-safe and documented.
- Breaking changes require:
  - migration notes
  - deprecation period (where feasible)
  - explicit changelog callouts

### 16.2 Correctness Gates

- All core ops must pass conformance tests on:
  - WebGPU (where supported)
  - WebGL fallback
  - CPU fallback
- Cross-backend parity checks must remain within defined tolerance thresholds.
- Golden fixtures must be versioned and reproducible in CI.

### 16.3 Performance Gates

- CI benchmark suite must run for key ops (`resize`, `cvtColor`, `normalize`, `threshold`, `gaussianBlur`, `sobel`).
- Regressions beyond agreed thresholds block release (latency, memory, throughput).
- Warm and cold start behavior must be measured and tracked.

### 16.4 Resource and Stability Gates

- No unbounded growth under stress loops (allocation/disposal cycling).
- Leak checks must pass for each backend runtime.
- Backend fallback path (WebGPU -> WebGL -> CPU) must be validated in automated tests.

### 16.5 Compatibility and Support Matrix

- Publish and maintain a browser/backend/op support matrix.
- Unsupported combinations must fail with actionable error messages.
- Runtime capability detection must be deterministic and test-covered.

### 16.6 Documentation and Developer Experience

- Required docs for release:
  - quickstart
  - API reference
  - backend selection and fallback behavior
  - performance guidance and known limits
- Provide runnable examples for common workflows.

### 16.7 CI/CD Requirements

- Required checks on pull requests:
  - typecheck
  - lint
  - conformance tests
  - parity tests
  - benchmark regression checks
  - bundle size check
- Releases are cut only from tagged, green CI commits.

### 16.8 Release Readiness Checklist (v1.0)

- API surface frozen and documented
- Conformance suite green across target browsers
- Performance baseline published
- No critical memory/stability issues open
- Migration and upgrade guidance published
