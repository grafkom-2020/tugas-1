function main() {

  // Inisiasi kanvas WebGL
  var leftCanvas = document.getElementById("leftCanvas");
  var rightCanvas = document.getElementById("rightCanvas");
  var leftGL = leftCanvas.getContext("webgl");
  var rightGL = rightCanvas.getContext("webgl");

  // Inisiasi verteks untuk alas
  var baseVertices = [
    -5.0, -0.5, -5.0, 17/255, 129/255, 24/255, 0.0, 1.0, 0.0,
    5.0, -0.5, -5.0, 17/255, 129/255, 24/255, 0.0, 1.0, 0.0,
    -5.0, -0.5, 5.0, 17/255, 129/255, 24/255, 0.0, 1.0, 0.0,
    -5.0, -0.5, 5.0, 17/255, 129/255, 24/255, 0.0, 1.0, 0.0,
    5.0, -0.5, 5.0, 17/255, 129/255, 24/255, 0.0, 1.0, 0.0,
    5.0, -0.5, -5.0, 17/255, 129/255, 24/255, 0.0, 1.0, 0.0
  ];

  // Inisiasi verteks persegi
  var rectangleVertices = [
    -0.5,  0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
     0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
     0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
     0.5,  0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    -0.5,  0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0
  ];

  // Inisiasi verteks kubus
  var cubeVertices = [];
  var cubePoints = [
    [-0.5,  0.5,  0.5],   // A, 0
    [-0.5, -0.5,  0.5],   // B, 1
    [ 0.5, -0.5,  0.5],   // C, 2 
    [ 0.5,  0.5,  0.5],   // D, 3
    [-0.5,  0.5, -0.5],   // E, 4
    [-0.5, -0.5, -0.5],   // F, 5
    [ 0.5, -0.5, -0.5],   // G, 6
    [ 0.5,  0.5, -0.5]    // H, 7 
  ];
  var cubeColors = [
      [],
      [1.0, 0.0, 0.0],    // merah
      [0.0, 1.0, 0.0],    // hijau
      [0.0, 0.0, 1.0],    // biru
      [1.0, 1.0, 1.0],    // putih
      [1.0, 0.5, 0.0],    // oranye
      [1.0, 1.0, 0.0],    // kuning
      []
  ];
  function quad(a, b, c, d, v) {
      var indices = [a, b, c, c, d, a];
      for (var i=0; i<indices.length; i++) {
          for (var j=0; j<3; j++) {
              cubeVertices.push(cubePoints[indices[i]][j]);
          }
          for (var j=0; j<3; j++) {
              cubeVertices.push(cubeColors[a][j]);
          }
          for (var j=0; j<3; j++) {
              cubeVertices.push(v[j]);
          }
      }
  }
  quad(1, 2, 3, 0, [0.0, 0.0, 1.0]); // Kubus depan
  quad(2, 6, 7, 3, [1.0, 0.0, 0.0]); // Kubus kanan
  quad(3, 7, 4, 0, [0.0, 1.0, 0.0]); // Kubus atas
  quad(4, 5, 1, 0, [-1.0, 0.0, 0.0]); // Kubus kiri
  quad(5, 4, 7, 6, [0.0, 0.0, -1.0]); // Kubus belakang
  quad(6, 2, 1, 5, [0.0, -1.0, 0.0]); // Kubus bawah

  // Penampungan vertices dari obyek-obyek
  var leftVertices = rectangleVertices.concat(baseVertices);
  var rightVertices = cubeVertices.concat(baseVertices);

  // Inisiasi VBO (Vertex Buffer Object)
  var leftVertexBuffer = leftGL.createBuffer();
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, leftVertexBuffer);
  leftGL.bufferData(leftGL.ARRAY_BUFFER, new Float32Array(leftVertices), leftGL.STATIC_DRAW);
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, null);
  var rightVertexBuffer = rightGL.createBuffer();
  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, rightVertexBuffer);
  rightGL.bufferData(rightGL.ARRAY_BUFFER, new Float32Array(rightVertices), rightGL.STATIC_DRAW);
  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, null);

  // Definisi Shaders
  var leftVertexShaderCode = `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute vec3 aNormal;
  varying vec3 vColor;
  varying vec3 vNormal;
  void main(void) {
    vColor = aColor;
    mat3 normal = mat3(1.0);
    vNormal = normalize(normal * aNormal);
    gl_Position = vec4(aPosition, 1.0);
  }
`
var leftFragmentShaderCode = `
  precision mediump float;
  varying vec3 vColor;
  varying vec3 vNormal;
  uniform float diffuseAngle;
  void main() {
    vec3 ambientValue = vec3(0.2, 0.2, 0.2);
    vec3 ambient = ambientValue * vColor;
    vec3 diffuseValue = vec3(1.0, 1.0, 1.0);
    float a = radians(diffuseAngle);
    mat3 rotation = mat3(
      cos(a), sin(a), 0.0,
      -sin(a), cos(a), 0.0,
      0.0, 0.0, 1.0
    );
    vec3 diffuseDirection = rotation * vec3(1.0, 0.0, 0.0);
    float normalDotLight = max(dot(vNormal, diffuseDirection), 0.0);
    vec3 diffuse = diffuseValue * vColor * normalDotLight;
    gl_FragColor = vec4(ambient + diffuse, 1.0);
  }
`
  var rightVertexShaderCode = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute vec3 aNormal;
    varying vec3 vColor;
    varying vec3 vNormal;
    uniform float aspectRatio;
    uniform mat3 normal;
    uniform mat4 modelView;
    void main(void) {
      vColor = aColor;
      vNormal = normalize(normal * aNormal);
      // Proyeksi perspektif
      float fov = radians(60.0);
      float f = 1.0 / tan(fov/2.0);
      float near = 1.0;
      float far = 50.0;
      float rangeInv = 1.0 / (near - far);
      mat4 projection = mat4(
        f / aspectRatio, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, near * far * rangeInv * 2.0,
        0, 0, -1, 0
      );

      gl_Position = projection * modelView * vec4(aPosition, 1.0);
    }
  `
  var rightFragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    varying vec3 vNormal;
    uniform float diffuseAngle;
    void main() {
      vec3 ambientValue = vec3(0.2, 0.2, 0.2);
      vec3 ambient = ambientValue * vColor;
      vec3 diffuseValue = vec3(1.0, 1.0, 1.0);
      float a = radians(diffuseAngle);
      mat3 rotation = mat3(
        cos(a), sin(a), 0.0,
        -sin(a), cos(a), 0.0,
        0.0, 0.0, 1.0
      );
      vec3 diffuseDirection = rotation * vec3(1.0, 0.0, 0.0);
      float normalDotLight = max(dot(vNormal, diffuseDirection), 0.0);
      vec3 diffuse = diffuseValue * vColor * normalDotLight;
      gl_FragColor = vec4(ambient + diffuse, 1.0);
    }
  `

  // Proses kompilasi, penautan (linking), dan eksekusi Shaders
  var leftVertexShader = leftGL.createShader(leftGL.VERTEX_SHADER);
  leftGL.shaderSource(leftVertexShader, leftVertexShaderCode);
  leftGL.compileShader(leftVertexShader);
  var leftFragmentShader = leftGL.createShader(leftGL.FRAGMENT_SHADER);
  leftGL.shaderSource(leftFragmentShader, leftFragmentShaderCode);
  leftGL.compileShader(leftFragmentShader);
  var leftProgram = leftGL.createProgram();
  leftGL.attachShader(leftProgram, leftVertexShader);
  leftGL.attachShader(leftProgram, leftFragmentShader);
  leftGL.linkProgram(leftProgram);
  leftGL.useProgram(leftProgram);
  var rightVertexShader = rightGL.createShader(rightGL.VERTEX_SHADER);
  rightGL.shaderSource(rightVertexShader, rightVertexShaderCode);
  rightGL.compileShader(rightVertexShader);
  var rightFragmentShader = rightGL.createShader(rightGL.FRAGMENT_SHADER);
  rightGL.shaderSource(rightFragmentShader, rightFragmentShaderCode);
  rightGL.compileShader(rightFragmentShader);
  var rightProgram = rightGL.createProgram();
  rightGL.attachShader(rightProgram, rightVertexShader);
  rightGL.attachShader(rightProgram, rightFragmentShader);
  rightGL.linkProgram(rightProgram);
  rightGL.useProgram(rightProgram);

  // Pengikatan VBO dan pengarahan pointer atribut posisi dan warna
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, leftVertexBuffer);
  var leftPosition = leftGL.getAttribLocation(leftProgram, "aPosition");
  leftGL.vertexAttribPointer(leftPosition, 3, leftGL.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 0);
  leftGL.enableVertexAttribArray(leftPosition);
  var leftColor = leftGL.getAttribLocation(leftProgram, "aColor");
  leftGL.vertexAttribPointer(leftColor, 3, leftGL.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  leftGL.enableVertexAttribArray(leftColor);
  var leftNormal = leftGL.getAttribLocation(leftProgram, "aNormal");
  leftGL.vertexAttribPointer(leftNormal, 3, leftGL.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
  leftGL.enableVertexAttribArray(leftNormal);
  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, rightVertexBuffer);
  var rightPosition = rightGL.getAttribLocation(rightProgram, "aPosition");
  rightGL.vertexAttribPointer(rightPosition, 3, rightGL.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 0);
  rightGL.enableVertexAttribArray(rightPosition);
  var rightColor = rightGL.getAttribLocation(rightProgram, "aColor");
  rightGL.vertexAttribPointer(rightColor, 3, rightGL.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  rightGL.enableVertexAttribArray(rightColor);
  var rightNormal = rightGL.getAttribLocation(rightProgram, "aColor");
  rightGL.vertexAttribPointer(rightNormal, 3, rightGL.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
  rightGL.enableVertexAttribArray(rightNormal);

  // Parameter proyeksi
  var aspectRatioLoc = rightGL.getUniformLocation(rightProgram, 'aspectRatio');
  rightGL.uniform1f(aspectRatioLoc, leftGL.canvas.width/leftGL.canvas.height);

  // Parameter animasi pencahayaan
  var diffuseAngle = 0.0; // dalam derajat
  var leftLocDiffuseAngle = leftGL.getUniformLocation(leftProgram, 'diffuseAngle');
  var rightLocDiffuseAngle = rightGL.getUniformLocation(rightProgram, 'diffuseAngle');

  // Definisi untuk matriks model dan view dari obyek (vertices)
  var rightLocModelView = rightGL.getUniformLocation(rightProgram, 'modelView');
  var model = glMatrix.mat4.create();
  var view = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(view,
    [2.5, 3.5, 5.5], // posisi kamera
    [0.0, 0.0, 0.0], // titik ke mana kamera melihat
    [0.0, 1.0, 0.0]  // vektor arah atas dari kamera
  );
  var modelView = glMatrix.mat4.create();
  glMatrix.mat4.multiply(modelView, view, model);
  rightGL.uniformMatrix4fv(rightLocModelView, false, modelView);

  // Definisi untuk matriks model vektor-vektor normal
  var rightLocNormal = rightGL.getUniformLocation(rightProgram, 'normal');
  var normal = glMatrix.mat3.create();
  glMatrix.mat3.normalFromMat4(normal, model);
  rightGL.uniformMatrix3fv(rightLocNormal, false, normal);

  // Persiapan tampilan layar dan mulai menggambar secara berulang (animasi)
  function render() {
    diffuseAngle += 1.0;
    leftGL.uniform1f(leftLocDiffuseAngle, diffuseAngle);
    leftGL.clear(leftGL.COLOR_BUFFER_BIT | leftGL.DEPTH_BUFFER_BIT);
    leftGL.drawArrays(leftGL.TRIANGLES, 0, 12);
    rightGL.uniform1f(rightLocDiffuseAngle, diffuseAngle);
    rightGL.clear(rightGL.COLOR_BUFFER_BIT | rightGL.DEPTH_BUFFER_BIT);
    rightGL.drawArrays(rightGL.TRIANGLES, 0, 42);
    requestAnimationFrame(render);
  }
  leftGL.clearColor(0.7, 0.7, 0.7, 1.0);
  leftGL.enable(leftGL.DEPTH_TEST);
  leftGL.viewport(0, (leftGL.canvas.height - leftGL.canvas.width)/2, leftGL.canvas.width, leftGL.canvas.width);
  rightGL.clearColor(0.0, 0.0, 0.0, 1.0);
  rightGL.enable(rightGL.DEPTH_TEST);
  rightGL.viewport(0, 0, rightGL.canvas.width, rightGL.canvas.height);
  render();
}