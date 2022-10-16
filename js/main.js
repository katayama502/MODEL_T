// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

function init() {
  // 画面サイズを指定
  const width = 1050;
  const height = 540;
  let rot = 0;

  // レンダラーを作成
  // THREE.WebGLRendererクラスのコンストラクターには引数として、HTMLに配置したcanvas要素を指定し、連携させます。
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
  });
  // レンダラーの大きさを設定(横.縦)
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  // 遠近感が適用されるカメラ
  // new THREE.PerspectiveCamera(視野角, アスペクト比)
  const camera = new THREE.PerspectiveCamera(45, width / height);

  // 平行光源を作成
  // new THREE.AmbientLight(色, 光の強さ)
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  // 光を当てる方向　(X.Y.Z)
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  // マテリアルを作成
  const material = new THREE.MeshStandardMaterial({
    // 画像の読み込み
    map: new THREE.TextureLoader().load('img/model.jpeg'),
    // 面のどちら側 (前面、背面、または両方) をレンダリングするかを定義します
    side: THREE.DoubleSide,
  });

  // 球体の形状を作成します
  // ジオメトリ（球体）
  const geometry = new THREE.SphereGeometry(300, 30, 30);
  // 形状とマテリアルからメッシュを作成します
  const earthMesh = new THREE.Mesh(geometry, material);
  // シーンにメッシュを追加します
  scene.add(earthMesh);

  // 星屑を作成します (カメラの動きをわかりやすくするため)
  createStarField();

  /** 星屑を作成します */
  function createStarField() {
    // 頂点情報を作詞絵
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      // Math.random() 関数は、 0 以上 1 未満 (0 は含むが、 1 は含まない) の範囲で浮動小数点の擬似乱数を返します。
      // 立方体の一辺が3000の距離の中に1000個の粒子を配置します。
      // x.y.zに頂点の情報を入れていきます。
      const x = 3000 * (Math.random() - 0.5);
      const y = 3000 * (Math.random() - 0.5);
      const z = 3000 * (Math.random() - 0.5);

      vertices.push(x, y, z);
    }

    // 形状データを作成
    // メッシュ、ライン、またはポイント ジオメトリの表現(バッファジオメトリ)
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // マテリアルを作成(粒子のサイズや色)
    // THREE.PointsMaterialクラスは形状を持たない為、視点が変化しても常に正面を向いて表示されます。
    const material = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff,
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
  }

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    rot += 0.5; // 毎フレーム角度を0.5度ずつ足していく
    // ラジアンに変換する
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    // 円周の半径 * Math.sin(角度 * Math.PI / 180)
    camera.position.x = 1000 * Math.sin(radian);
    // 円周の半径 * Math.cos(角度 * Math.PI / 180);
    camera.position.z = 1000 * Math.cos(radian);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }
}
