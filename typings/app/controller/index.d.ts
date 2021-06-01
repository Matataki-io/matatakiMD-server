// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGithub from '../../../app/controller/github';
import ExportHome from '../../../app/controller/home';
import ExportIpfs from '../../../app/controller/ipfs';
import ExportMtk from '../../../app/controller/mtk';
import ExportOss from '../../../app/controller/oss';

declare module 'egg' {
  interface IController {
    github: ExportGithub;
    home: ExportHome;
    ipfs: ExportIpfs;
    mtk: ExportMtk;
    oss: ExportOss;
  }
}
