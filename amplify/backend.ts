import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { fileConversion } from './function/file-conversion/resource';
import { mediaConversion } from './function/media-conversion/resource';
import { filterService } from './function/file-filter/resource';
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  fileConversion,
  filterService,
  mediaConversion
});
