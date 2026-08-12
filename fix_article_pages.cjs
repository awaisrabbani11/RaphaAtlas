const fs = require('fs');
const img8 = 'https://i.pinimg.com/736x/55/32/75/553275dc88945dfb4fc37c8a2dd97ddd.jpg';
const img9 = 'https://i.pinimg.com/736x/79/02/79/790279d5949b299caa9a3d1e662c12d8.jpg';

if (fs.existsSync('nutrition.html')) {
  let nut = fs.readFileSync('nutrition.html', 'utf8');
  nut = nut.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDiOWSu1VgJWfrPUi1u0gFzCuIkqDh1gj0Zwn2DySlTtXtxYnbJyrgZA19CrbMFOhjMMBTV4-BpI8f7fQnAtKlOhLIOKEGkVcd9s-OIlK7IN3Rc57RgYA2b8tr2pfhwCSImSdOOOLH87TgH4Ffd3FYn_VE0hJ83WJwfXQkFoWduVbQ8-JaVUXp8ept75NDqwVKi16Lh8NjE7uw4rik3-99LUJyn2A-51J66WieywIEkydO0-jWPtZIb"/, `src="${img8}"`);
  fs.writeFileSync('nutrition.html', nut);
}

if (fs.existsSync('fitness.html')) {
  let fit = fs.readFileSync('fitness.html', 'utf8');
  fit = fit.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuBxkUSnpjRjYixLmevx2qQtzc613758JrJ41pYcy9USMoMDqzJbNmORDsVmJsMZ8QPsT6Dni6iekaWUoBf7Ioy0E_Jeef0IUWkkn_HQP_icfnDp0ecC_vGGfsRrO4R7fkbrZ7kKTYW2z-Vrt8_ZDCGRB8OoR_HPyuNTiM0UUwd11oi-sfbfBWxjic0XVdBrzJEohj3_mM6z9pHBqWZPbukzeyxHvGM8YB38CaicuOAoMMhVuEje1Uql"/, `src="${img9}"`);
  fs.writeFileSync('fitness.html', fit);
}
console.log('Article placeholder pages images replaced');
