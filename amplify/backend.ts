import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { fileConversion } from './function/file-conversion/resource';
import { mediaConversion } from './function/media-conversion/resource';
import { filterService } from './function/file-filter/resource';
import { audioFilter } from './function/audio-filter/resource';
import { shippingCost } from './function/shipping-cost/resource';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  fileConversion,
  filterService,
  mediaConversion,
  audioFilter,
  shippingCost
});

// Create Sharp Lambda Layer for native dependency support
const sharpLayer = new lambda.LayerVersion(
  backend.mediaConversion.resources.lambda,
  'SharpLayer',
  {
    code: lambda.Code.fromAsset(
      path.join(__dirname, '../lambda-layers/sharp-layer/sharp-layer.zip')
    ),
    compatibleRuntimes: [lambda.Runtime.NODEJS_20_X, lambda.Runtime.NODEJS_22_X],
    description: 'Sharp image processing library with Linux x64 binaries'
  }
);

// Add Sharp layer to media-conversion and file-filter functions
const mediaLambda = backend.mediaConversion.resources.lambda as lambda.Function;
const filterLambda = backend.filterService.resources.lambda as lambda.Function;

mediaLambda.addLayers(sharpLayer);
filterLambda.addLayers(sharpLayer);
