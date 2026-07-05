import path from 'path';
import { Config } from '@remotion/cli/config';

Config.setPublicDir(path.resolve(process.cwd(), 'public'));

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setConcurrency(1);
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setOffthreadVideoCacheSizeInBytes(512 * 1024 * 1024);
