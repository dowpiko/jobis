// 폴더 안 모든 png/jpg/svg를 배열로 가져오기
const importAll = r => r.keys().map(r);

export const profileImages = importAll(
  require.context('../img/profile', false, /\.(png|jpe?g|svg)$/)
);
// 필요하면 이름까지 포함
export const profileImageList = profileImages.map(src => ({
  name: src.split('/').pop(),
  src
}));