import { defineBackend } from '@aws-amplify/backend';
import { fileConversion } from './functions/file-conversion/resource';
import { mediaConversion } from './functions/media-conversion/resource';
import { filterService } from './functions/filter-service/resource';
import { data } from './data/resource';

defineBackend({
  fileConversion,
  mediaConversion,
  filterService,
  data
});