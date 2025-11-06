import { Code, Binary, Hash, Link, Code2, Key, Clock, Braces } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Developer Tools Registry
 * All developer/technical tools are registered here
 */
export const developerTools: ConverterMetadata[] = [
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    category: "developer",
    icon: Braces,
    href: "/dev-tools/json-formatter",
    keywords: ["json", "format", "beautify", "validate", "minify", "parser"],
    popular: true,
  },
  {
    id: "base64-encoder",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    category: "developer",
    icon: Binary,
    href: "/dev-tools/base64",
    keywords: ["base64", "encode", "decode", "encoding", "binary"],
    popular: true,
  },
  {
    id: "url-encoder",
    title: "URL Encoder/Decoder",
    description: "Encode and decode URL strings",
    category: "developer",
    icon: Link,
    href: "/dev-tools/url-encoder",
    keywords: ["url", "encode", "decode", "uri", "percent encoding"],
    popular: true,
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes",
    category: "developer",
    icon: Hash,
    href: "/dev-tools/hash-generator",
    keywords: ["hash", "md5", "sha", "sha256", "checksum", "crypto"],
    popular: true,
  },
  {
    id: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUIDs (v4) and GUIDs",
    category: "developer",
    icon: Key,
    href: "/dev-tools/uuid-generator",
    keywords: ["uuid", "guid", "unique", "identifier", "generate"],
    popular: true,
  },
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates",
    category: "developer",
    icon: Clock,
    href: "/dev-tools/timestamp-converter",
    keywords: ["timestamp", "unix", "epoch", "date", "time", "convert"],
    popular: true,
  },
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test and debug regular expressions",
    category: "developer",
    icon: Code2,
    href: "/dev-tools/regex-tester",
    keywords: ["regex", "regexp", "regular expression", "pattern", "match"],
    popular: false,
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens",
    category: "developer",
    icon: Code,
    href: "/dev-tools/jwt-decoder",
    keywords: ["jwt", "json web token", "decode", "auth", "token"],
    popular: false,
  },
]
