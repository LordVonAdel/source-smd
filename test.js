const SMD = require("./StudioMDL.js");
const fs = require("fs");

function createCube(size) {
  // UV's and face directions are messed up. But works for testing
  let smd = SMD.createSimple();
  smd.addNode("animated", 0);
  let material = "test_cube";

  // Bottom
  smd.addQuad(material,
    SMD.createVertex(1, 0, 0, 0, 0, 0, -1, 0, 0),
    SMD.createVertex(1, size, 0, 0, 0, 0, -1, 1, 0),
    SMD.createVertex(1, size, 0, size, 0, 0, -1, 1, 1),
    SMD.createVertex(1, 0, 0, size, 0, 0, -1, 0, 1)
  );

  // Top
  smd.addQuad(material,
    SMD.createVertex(1, 0, size, 0, 0, 0, -1, 0, 0),
    SMD.createVertex(1, size, size, 0, 0, 0, -1, 1, 0),
    SMD.createVertex(1, size, size, size, 0, 0, -1, 1, 1),
    SMD.createVertex(1, 0, size, size, 0, 0, -1, 0, 1)
  );

  // Left
  smd.addQuad(material,
    SMD.createVertex(1, 0, 0, 0, -1, 0, 0, 0, 0),
    SMD.createVertex(1, 0, 0, size, -1, 0, 0, 1, 0),
    SMD.createVertex(1, 0, size, size, -1, 0, 0, 1, 1),
    SMD.createVertex(1, 0, size, 0, -1, 0, 0, 0, 1)
  );

  // Right
  smd.addQuad(material,
    SMD.createVertex(1, size, 0, 0, 1, 0, 0, 0, 0),
    SMD.createVertex(1, size, 0, size, 1, 0, 0, 1, 0),
    SMD.createVertex(1, size, size, size, 1, 0, 0, 1, 1),
    SMD.createVertex(1, size, size, 0, 1, 0, 0, 0, 1)
  );

  // Front
  smd.addQuad(material,
    SMD.createVertex(1, 0, 0, 0, 1, 0, -1, 0, 0),
    SMD.createVertex(1, size, 0, 0, 1, 0, -1, 1, 0),
    SMD.createVertex(1, size, size, 0, 1, 0, -1, 1, 1),
    SMD.createVertex(1, 0, size, 0, 1, 0, -1, 0, 1)
  );

  // Back
  smd.addQuad(material,
    SMD.createVertex(1, 0, 0, size, 1, 0, -1, 0, 0),
    SMD.createVertex(1, size, 0, size, 1, 0, -1, 1, 0),
    SMD.createVertex(1, size, size, size, 1, 0, -1, 1, 1),
    SMD.createVertex(1, 0, size, size, 1, 0, -1, 0, 1)
  );

  smd.addSkeleton(1, 1, 0, 0, 0, 0, 0, 0);
  smd.addSkeleton(2, 1, 0, 0, 1, Math.PI, 0, 0);
  smd.addSkeleton(3, 1, 0, 0, 0, 0, 0, 0);

  return smd;
}

function loadFromObj(filename) {
  let data = fs.readFileSync(filename);
  return SMD.fromObj(data.toString("ascii"));
}

let smd = createCube(64);
fs.writeFileSync("test/test_cube.smd", smd.export());

smd = loadFromObj("test/testmodel.obj");
fs.writeFileSync("test/test_obj.smd", smd.export());