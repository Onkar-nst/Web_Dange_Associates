import * as THREE from "three";

// Shader patches that put real photographic PBR textures on procedural geometry.

const ANTI_TILE = /* glsl */ `
vec3 antiTile(sampler2D t, vec2 uv) {
  vec3 a = texture2D(t, uv).rgb;
  vec3 b = texture2D(t, uv * 0.43 + vec2(0.37, 0.71)).rgb;
  float n = texture2D(t, uv * 0.031 + vec2(0.13, 0.57)).g;
  float k = smoothstep(0.15, 0.6, n);
  return mix(a, b, 0.45) * (0.86 + 0.28 * k);
}
`;

let keySeq = 0;
const withKey = (mat, name) => {
  const key = `${name}-${keySeq++}`;
  mat.customProgramCacheKey = () => key;
  return mat;
};

const worldPosVertex = (varName) => ({
  decl: `varying vec3 ${varName};`,
  code: `
  #ifdef USE_INSTANCING
    ${varName} = (modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
  #else
    ${varName} = (modelMatrix * vec4(position, 1.0)).xyz;
  #endif`,
});

// ---- Site-plan terrain: grass / lawn / asphalt / pavers / paint / coloured overlays
export function terrainMaterial({ mask, mask2, overlay, tex }) {
  const mat = new THREE.MeshStandardMaterial({ map: mask, roughness: 0.95, metalness: 0 });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uMask2: { value: mask2 },
      uOverlay: { value: overlay },
      uGrass: { value: tex.grass },
      uLawn: { value: tex.lawn },
      uAsphalt: { value: tex.asphalt },
      uPaver: { value: tex.paver },
      uConcrete: { value: tex.concrete },
    });
    const wp = worldPosVertex("vTerrainPos");
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${wp.decl}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${wp.code}`);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vTerrainPos;
        uniform sampler2D uMask2, uOverlay, uGrass, uLawn, uAsphalt, uPaver, uConcrete;
        ${ANTI_TILE}`,
      )
      .replace(
        "#include <map_fragment>",
        `
        vec4 tm = texture2D(map, vMapUv);
        vec4 tm2 = texture2D(uMask2, vMapUv);
        vec4 ov = texture2D(uOverlay, vMapUv);
        vec2 wp = vTerrainPos.xz;
        vec3 grass = antiTile(uGrass, wp / 16.0) * vec3(0.74, 1.02, 0.5);
        vec3 lawn = antiTile(uLawn, wp / 5.0) * vec3(0.66, 1.08, 0.42);
        vec3 asph = antiTile(uAsphalt, wp / 6.0) * 0.9;
        vec3 pav = texture2D(uPaver, wp / 2.2).rgb * vec3(1.0, 0.95, 0.9);
        vec3 conc = texture2D(uConcrete, wp / 2.5).rgb;
        float grain = dot(conc, vec3(0.3333));
        vec3 col = mix(grass, lawn, tm2.r);
        col = mix(col, conc * (0.5 / 0.157), tm2.g);
        col = mix(col, pav, tm.g);
        col = mix(col, asph, tm.r);
        col = mix(col, vec3(0.8) * (0.8 + 0.4 * grain), tm.b);
        col = mix(col, ov.rgb * (0.7 + 0.6 * grain), ov.a);
        diffuseColor.rgb = col;
        float terrainRough = mix(mix(0.97, 0.9, tm.r), 0.75, tm.b);
        `,
      )
      .replace("#include <roughnessmap_fragment>", "float roughnessFactor = terrainRough;");
  };
  return withKey(mat, "terrain");
}

// ---- Highway strip (tiled 40 m mask): asphalt, gravel shoulder, paint, grass median
export function highwayMaterial({ mask, tex }) {
  const mat = new THREE.MeshStandardMaterial({ map: mask, roughness: 0.92 });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uGrass: { value: tex.grass }, uAsphalt: { value: tex.asphalt }, uDirt: { value: tex.dirt } });
    const wp = worldPosVertex("vTerrainPos");
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${wp.decl}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${wp.code}`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vTerrainPos;\nuniform sampler2D uGrass, uAsphalt, uDirt;\n${ANTI_TILE}`)
      .replace(
        "#include <map_fragment>",
        `
        vec4 tm = texture2D(map, vMapUv);
        vec2 wp = vTerrainPos.xz;
        vec3 col = antiTile(uGrass, wp / 16.0) * vec3(0.74, 1.02, 0.5);
        col = mix(col, antiTile(uDirt, wp / 3.0) * vec3(0.78, 0.76, 0.74), tm.g);
        col = mix(col, antiTile(uAsphalt, wp / 6.0) * 0.82, tm.r);
        col = mix(col, vec3(0.78), tm.b);
        diffuseColor.rgb = col;
        `,
      );
  };
  return withKey(mat, "highway");
}

// ---- Open countryside: anti-tiled aerial grass with dry patches
export function groundMaterial(tex) {
  const mat = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uGrass: { value: tex.grass }, uSoil: { value: tex.soil } });
    const wp = worldPosVertex("vTerrainPos");
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${wp.decl}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${wp.code}`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vTerrainPos;\nuniform sampler2D uGrass, uSoil;\n${ANTI_TILE}`)
      .replace(
        "#include <map_fragment>",
        `
        vec2 wp = vTerrainPos.xz;
        vec3 g = antiTile(uGrass, wp / 16.0) * vec3(0.74, 1.02, 0.5);
        vec3 s = texture2D(uSoil, wp / 7.0).rgb * vec3(1.1, 1.0, 0.9);
        float patchy = smoothstep(0.52, 0.7, texture2D(uGrass, wp / 900.0 + 0.3).g * 0.6 + texture2D(uSoil, wp / 380.0).r * 0.7);
        diffuseColor.rgb = mix(g, mix(g, s, 0.45), patchy * 0.5);
        `,
      );
  };
  return withKey(mat, "ground");
}

// ---- Plot blocks: raked soil with lime boundary lines and plot numbers
export function blockMaterial({ mask, tex, normal }) {
  const mat = new THREE.MeshStandardMaterial({ map: mask, normalMap: normal, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1 });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uDirt: { value: tex.dirt }, uConcrete: { value: tex.concrete } });
    const wp = worldPosVertex("vTerrainPos");
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${wp.decl}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${wp.code}`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vTerrainPos;\nuniform sampler2D uDirt, uConcrete;\n${ANTI_TILE}`)
      .replace(
        "#include <map_fragment>",
        `
        vec4 bm = texture2D(map, vMapUv);
        vec2 wp = vTerrainPos.xz;
        vec3 dirt = antiTile(uDirt, wp / 3.2) * vec3(1.12, 1.0, 0.86);
        vec3 conc = texture2D(uConcrete, wp / 2.5).rgb * (0.48 / 0.157);
        vec3 col = mix(dirt, vec3(0.9, 0.89, 0.85) * (0.85 + 0.3 * dirt.r), bm.r * 0.92);
        col = mix(col, dirt * 0.42, bm.g * 0.9);
        col = mix(col, conc, bm.b);
        diffuseColor.rgb = col;
        `,
      );
  };
  return withKey(mat, "block");
}

// ---- Triplanar world-space texturing for buildings (works with InstancedMesh)
// mode "color": diffuse *= texture          (plaster, concrete, brick …)
// mode "detail": diffuse *= mix(1, texture/mean, amount)   (keeps vertex/instance colours)
export function triplanar(mat, { map, scale = 2, mode = "color", amount = 0.6, mean = 0.7, map2 = null, mix2 = null, tint2 = null, mean2 = 1 }) {
  const uniforms = {
    uTri: { value: map },
    uTriScale: { value: 1 / scale },
    uTriAmount: { value: amount },
    uTriMean: { value: mean },
    uTri2: { value: map2 },
    uTriMix: mix2 || { value: 0 },
    uTriTint2: { value: tint2 || new THREE.Color(1, 1, 1) },
    uTriMean2: { value: mean2 },
  };
  mat.userData.tri = uniforms;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vTriPos;\nvarying vec3 vTriNrm;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vTriPos = (modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
          vTriNrm = mat3(modelMatrix) * mat3(instanceMatrix) * normal;
        #else
          vTriPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vTriNrm = mat3(modelMatrix) * normal;
        #endif`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vTriPos; varying vec3 vTriNrm;
        uniform sampler2D uTri; uniform float uTriScale; uniform float uTriAmount; uniform float uTriMean;
        ${map2 ? "uniform sampler2D uTri2; uniform float uTriMix; uniform vec3 uTriTint2; uniform float uTriMean2;" : ""}
        vec3 triSample(sampler2D t, vec3 p, vec3 w) {
          return texture2D(t, p.zy).rgb * w.x + texture2D(t, p.xz).rgb * w.y + texture2D(t, p.xy).rgb * w.z;
        }`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec3 triW = pow(abs(normalize(vTriNrm)), vec3(6.0));
        triW /= (triW.x + triW.y + triW.z);
        vec3 triP = vTriPos * uTriScale;
        vec3 triC = triSample(uTri, triP, triW);
        ${map2 ? "triC = mix(triC, mix(vec3(1.0), triSample(uTri2, triP, triW) / uTriMean2, 0.55) * uTriTint2, uTriMix);" : ""}
        ${mode === "detail" ? "diffuseColor.rgb *= mix(vec3(1.0), triC / uTriMean, uTriAmount);" : "diffuseColor.rgb *= triC;"}
        `,
      );
  };
  return withKey(mat, "tri");
}

// ---- Photoreal tree impostors: camera-facing cards that pick the baked view closest to the camera
export function impostorMaterial(atlas, meta, variant = 0) {
  const v = meta.variants[variant];
  const el = meta.elevations.map((e) => (e * Math.PI) / 180);
  const mat = new THREE.MeshBasicMaterial({ map: atlas, alphaTest: 0.5, color: 0xffffff });
  const uniforms = {
    uCols: { value: meta.cols },
    uRows: { value: meta.rows },
    uRowOffset: { value: variant * meta.elevations.length },
    uElev: { value: new THREE.Vector3(...el) },
    uRowH: { value: new THREE.Vector3(...v.rowH) },
    uRxz: { value: v.rxz },
    uCenterY: { value: v.centerY },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uCols, uRows, uRowOffset, uRxz, uCenterY; uniform vec3 uElev, uRowH;
        varying vec2 vUvA; varying vec2 vUvB; varying float vBlend;`,
      )
      .replace(
        "#include <project_vertex>",
        `
        mat4 im = modelMatrix;
        #ifdef USE_INSTANCING
          im = modelMatrix * instanceMatrix;
        #endif
        vec3 base = (im * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        float sc = length((im * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
        vec3 ctr = base + vec3(0.0, uCenterY * sc, 0.0);
        vec3 toCam = cameraPosition - ctr;
        float az = atan(toCam.z, toCam.x);
        float elv = atan(toCam.y, length(toCam.xz));
        float row = elv < (uElev.x + uElev.y) * 0.5 ? 0.0 : (elv < (uElev.y + uElev.z) * 0.5 ? 1.0 : 2.0);
        float rowH = row < 0.5 ? uRowH.x : (row < 1.5 ? uRowH.y : uRowH.z);
        float fa = mod(az / 6.2831853 * uCols + uCols, uCols);
        float c0 = floor(fa);
        float c1 = mod(c0 + 1.0, uCols);
        vBlend = fa - c0;
        vec3 f = normalize(toCam);
        vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));
        vec3 u = cross(f, r);
        vec3 wpos = ctr + r * position.x * (2.0 * uRxz * sc) + u * position.y * (rowH * sc);
        vec4 mvPosition = viewMatrix * vec4(wpos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vec2 bq = position.xy + 0.5;
        float vv = 1.0 - (uRowOffset + row + 1.0 - bq.y) / uRows;
        vUvA = vec2((c0 + bq.x) / uCols, vv);
        vUvB = vec2((c1 + bq.x) / uCols, vv);
        `,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vUvA; varying vec2 vUvB; varying float vBlend;")
      .replace(
        "#include <map_fragment>",
        `
        vec4 tA = texture2D(map, vUvA);
        vec4 tB = texture2D(map, vUvB);
        vec4 tex = mix(tA, tB, smoothstep(0.25, 0.75, vBlend));
        diffuseColor *= tex;
        `,
      );
  };
  return withKey(mat, `imp-${variant}`);
}
