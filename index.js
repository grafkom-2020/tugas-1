function main() {

  // Inisiasi kanvas WebGL
  var leftCanvas = document.getElementById("leftCanvas");
  var rightCanvas = document.getElementById("rightCanvas");
  var leftGL = leftCanvas.getContext("webgl");
  var rightGL = rightCanvas.getContext("webgl");

  // Inisiasi verteks persegi
  var rectangleVertices = [
    -0.5,  0.5,
    -0.5, -0.5,
    0.5, -0.5,
    0.5,  0.5
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
  function quad(a, b, c, d) {
      var indices = [a, b, c, c, d, a];
      for (var i=0; i<indices.length; i++) {
          for (var j=0; j<3; j++) {
              cubeVertices.push(cubePoints[indices[i]][j]);
          }
          for (var j=0; j<3; j++) {
              cubeVertices.push(cubeColors[a][j]);
          }
      }
  }
  quad(1, 2, 3, 0); // Kubus depan
  quad(2, 6, 7, 3); // Kubus kanan
  quad(3, 7, 4, 0); // Kubus atas
  quad(4, 5, 1, 0); // Kubus kiri
  quad(5, 4, 7, 6); // Kubus belakang
  quad(6, 2, 1, 5); // Kubus bawah

  // Inisiasi VBO (Vertex Buffer Object)
  var leftVertexBuffer = leftGL.createBuffer();
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, leftVertexBuffer);
  leftGL.bufferData(leftGL.ARRAY_BUFFER, new Float32Array(rectangleVertices), leftGL.STATIC_DRAW);
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, null);
  var rightVertexBuffer = rightGL.createBuffer();
  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, rightVertexBuffer);
  rightGL.bufferData(rightGL.ARRAY_BUFFER, new Float32Array(cubeVertices), rightGL.STATIC_DRAW);
  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, null);

  // Definisi Shaders
  var leftVertexShaderCode = `
  attribute vec2 aPosition;
  uniform float angle;
  void main(void) {
    float a = radians(angle);
    mat4 rotation = mat4(
      cos(a), sin(a), 0, 0,
      -sin(a), cos(a), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
    gl_Position = rotation * vec4(aPosition, 0.0, 1.0);
  }
`
var leftFragmentShaderCode = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.3, 0.3, 0.3, 1.0);
  }
`
  var rightVertexShaderCode = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;
    uniform float angleX;
    uniform float angleY;
    uniform float aspectRatio;
    void main(void) {
      vColor = aColor;
      float ax = radians(angleX);
      float ay = radians(angleY);
      mat4 rx = mat4(
        1, 0, 0, 0,
        0, cos(ax), sin(ax), 0,
        0, -sin(ax), cos(ax), 0,
        0, 0, 0, 1
      );
      mat4 ry = mat4(
        cos(ay), 0, -sin(ay), 0,
        0, 1, 0, 0,
        sin(ay), 0, cos(ay), 0,
        0, 0, 0, 1
      );
      mat4 translate = mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -1.5, 1
      );

      mat4 model = translate * ry * rx;
      mat4 view = mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
      
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

      gl_Position = projection * view * model * vec4(aPosition, 1.0);
    }
  `
  var rightFragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `

  // Proses kompilasi, penautan (linking), dan eksekusi Shaders
  var vertexShader = leftGL.createShader(leftGL.VERTEX_SHADER);
  leftGL.shaderSource(vertexShader, leftVertexShaderCode);
  leftGL.compileShader(vertexShader);
  var fragmentShader = leftGL.createShader(leftGL.FRAGMENT_SHADER);
  leftGL.shaderSource(fragmentShader, leftFragmentShaderCode);
  leftGL.compileShader(fragmentShader);
  var leftProgram = leftGL.createProgram();
  leftGL.attachShader(leftProgram, vertexShader);
  leftGL.attachShader(leftProgram, fragmentShader);
  leftGL.linkProgram(leftProgram);
  leftGL.useProgram(leftProgram);
  var vertexShader = rightGL.createShader(rightGL.VERTEX_SHADER);
  rightGL.shaderSource(vertexShader, rightVertexShaderCode);
  rightGL.compileShader(vertexShader);
  var fragmentShader = rightGL.createShader(rightGL.FRAGMENT_SHADER);
  rightGL.shaderSource(fragmentShader, rightFragmentShaderCode);
  rightGL.compileShader(fragmentShader);
  var rightProgram = rightGL.createProgram();
  rightGL.attachShader(rightProgram, vertexShader);
  rightGL.attachShader(rightProgram, fragmentShader);
  rightGL.linkProgram(rightProgram);
  rightGL.useProgram(rightProgram);

  // Pengikatan VBO dan pengarahan pointer atribut posisi dan warna
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, leftVertexBuffer);
  var leftPosition = leftGL.getAttribLocation(leftProgram, "aPosition");
  leftGL.vertexAttribPointer(leftPosition, 2, leftGL.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
  leftGL.enableVertexAttribArray(leftPosition);
  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, rightVertexBuffer);
  var rightPosition = rightGL.getAttribLocation(rightProgram, "aPosition");
  rightGL.vertexAttribPointer(rightPosition, 3, rightGL.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  rightGL.enableVertexAttribArray(rightPosition);
  var color = rightGL.getAttribLocation(rightProgram, "aColor");
  rightGL.vertexAttribPointer(color, 3, rightGL.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  rightGL.enableVertexAttribArray(color);

  // Parameter animasi
  var leftAngle = 0.0;
  var leftAngleLoc = leftGL.getUniformLocation(leftProgram, 'angle');
  var rightAngleX = 0.0;
  var rightAngleXLoc = rightGL.getUniformLocation(rightProgram, 'angleX');
  var rightAngleY = 0.0;
  var rightAngleYLoc = rightGL.getUniformLocation(rightProgram, 'angleY');
  var aspectRatioLoc = rightGL.getUniformLocation(rightProgram, 'aspectRatio');
  rightGL.uniform1f(aspectRatioLoc, leftGL.canvas.width/leftGL.canvas.height);

  // Persiapan tampilan layar dan mulai menggambar secara berulang (animasi)
  function render() {
    leftAngle -= 0.5;
    leftGL.uniform1f(leftAngleLoc, leftAngle);
    leftGL.clear(leftGL.COLOR_BUFFER_BIT);
    leftGL.drawArrays(leftGL.TRIANGLE_FAN, 0, 4);
    rightAngleX += 0.25;
    rightGL.uniform1f(rightAngleXLoc, rightAngleX);
    rightAngleY += 0.75;
    rightGL.uniform1f(rightAngleYLoc, rightAngleY);
    rightGL.clear(rightGL.COLOR_BUFFER_BIT | rightGL.DEPTH_BUFFER_BIT);
    rightGL.drawArrays(rightGL.TRIANGLES, 0, 36);
    requestAnimationFrame(render);
  }
  leftGL.clearColor(0.7, 0.7, 0.7, 1.0);
  leftGL.viewport(0, (leftGL.canvas.height - leftGL.canvas.width)/2, leftGL.canvas.width, leftGL.canvas.width);
  rightGL.clearColor(0.0, 0.0, 0.0, 1.0);
  rightGL.enable(rightGL.DEPTH_TEST);
  rightGL.viewport(0, 0, rightGL.canvas.width, rightGL.canvas.height);
  render();
}