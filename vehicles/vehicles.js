import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const modelIds = new Set(['s', '3', 'x', 'y', 'cybertruck']);
const downloads = new Map();
const loader = new GLTFLoader();

function normalizeId(value) {
  const key = String(value).toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^tesla/, '').replace(/^model/, '');
  if (!modelIds.has(key)) throw new RangeError(`Unknown Tesla model: ${value}`);
  return key;
}

async function readModelFile(response) {
  if (!response.ok) throw new Error('模型下載失敗，HTTP '+response.status);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return bytes.buffer;
  if ('DecompressionStream' in globalThis) {
    const decoded = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(decoded).arrayBuffer();
  }
  const {gunzipSync} = await import('../vendor/fflate.module.js');
  return gunzipSync(bytes).buffer;
}

function download(id) {
  if (!downloads.has(id)) {
    const url = new URL(`./${id}.glb.gz`, import.meta.url);
    const request = fetch(url).then(readModelFile).catch(error => {
      downloads.delete(id);
      throw error;
    });
    downloads.set(id, request);
  }
  return downloads.get(id);
}

export function setVehiclePaint(car, paintHex) {
  for (const material of car.userData.paintMaterials) material.color.set(paintHex);
}

// Each instance owns its geometries and materials. Only the downloaded GLB bytes are cached.
export async function loadVehicle(THREE, vehicleId, paintHex) {
  const id = normalizeId(vehicleId);
  const result = await loader.parseAsync(await download(id), '');
  const car = new THREE.Group();
  car.name = `Tesla ${id === 'cybertruck' ? 'Cybertruck' : 'Model ' + id.toUpperCase()}`;
  car.userData.vehicleId = id;
  const paintMaterials = new Set();
  car.add(result.scene);
  car.traverse(mesh => {
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mesh.castShadow = materials.some(material => !material.transparent);
    mesh.receiveShadow = !materials.every(material => material.transparent);
    for (const material of materials) {
      if (material.userData.paint) paintMaterials.add(material);
      if (material.transparent) {
        material.depthWrite = false;
        mesh.renderOrder = material.name === 'clearLens' ? 3 : 2;
      }
    }
  });
  car.userData.paintMaterials = [...paintMaterials];
  if (paintHex !== undefined && paintHex !== null) setVehiclePaint(car, paintHex);
  return car;
}
