import type { AboutContent } from './types';

export const defaultAboutContent: AboutContent = {
  heading: 'plusplus7 / 加七',
  intro: '本职程序员，从事网络安全相关开发工作。如果需要正式简历，可以通过公开邮箱联系。',
  sections: [
    {
      term: '技术',
      description: '后台研发为主，也写 React / TypeScript 前端；喜欢折腾新技术并把它们用在自己的站点和工具里。',
    },
    {
      term: '经历',
      description: '目前就职于雷德蒙德某软件公司的中国分公司，曾就职于杭州某电商公司；曾参与 NOIP 和 ACM/ICPC，目前均已退役。',
    },
    {
      term: '兴趣',
      description: '背包旅行、电子游戏、游戏制作、游戏解说和旅行 Vlog。喜欢和不同国家、不同文化的人交流。',
    },
    {
      term: '联系',
      description: 'jackiedeng.cn # gmail.com',
    },
  ],
};
