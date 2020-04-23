const SMD = require("./StudioMDL.js");
const fs = require("fs");

function createCube(size) {
  // UV's and face directions are messed up. But works for testing
  let smd = SMD.createSimple();
  let material = "test_cube";

  // Front
  smd.addTriangle(material,
    SMD.createVertex(0, size, 0, 0, 0, 0, -1, 1, 0),
    SMD.createVertex(0, 0, 0, 0, 0, 0, -1, 0, 0),
    SMD.createVertex(0, size, size, 0, 0, 0, -1, 1, 1)
  );
  smd.addTriangle(material,
    SMD.createVertex(0, 0, 0, 0, 0, 0, -1, 0, 0),
    SMD.createVertex(0, size, size, 0, 0, 0, -1, 1, 1),
    SMD.createVertex(0, 0, size, 0, 0, 0, -1, 0, 1)
  );

  // Back
  smd.addTriangle(material,
    SMD.createVertex(0,  size, 0   , size,  0, 0, 1,  1, 0),
    SMD.createVertex(0,  0   , 0   , size,  0, 0, 1,  0, 0),
    SMD.createVertex(0,  size, size, size,  0, 0, 1,  1, 1)
  );
  smd.addTriangle(material,
    SMD.createVertex(0, 0, 0, size, 0, 0, 1, 0, 0),
    SMD.createVertex(0, size, size, size, 0, 0, 1, 1, 1),
    SMD.createVertex(0, 0, size, size, 0, 0, 1, 0, 1)
  );

  // Bottom
  smd.addTriangle(material,
    SMD.createVertex(0, 0, 0, 0, 0, -1, 0, 0, 0),
    SMD.createVertex(0, size, 0, 0, 0, -1, 0, 1, 0),
    SMD.createVertex(0, size, 0, size, 0, -1, 0, 1, 1)
  );
  smd.addTriangle(material,
    SMD.createVertex(0, 0, 0, size, 0, -1, 0, 0, 1),
    SMD.createVertex(0, 0, 0, 0, 0, -1, 0, 0, 0),
    SMD.createVertex(0, size, 0, size, 0, -1, 0, 1, 1)
  );

  // Top
  smd.addTriangle(material,
    SMD.createVertex(0, size, size, 0, 0, 1, 0, 1, 0),
    SMD.createVertex(0, 0, 0, size, 0, 1, 0, 0, 0),
    SMD.createVertex(0, size, size, size, 0, 1, 0, 1, 1)
  );
  smd.addTriangle(material,
    SMD.createVertex(0, 0, size, 0, 0, 1, 0, 0, 0),
    SMD.createVertex(0, 0, size, size, 0, 1, 0, 0, 1),
    SMD.createVertex(0, size, size, size, 0, 1, 0, 1, 1)
  );

  // Left
  smd.addTriangle(material,
    SMD.createVertex(0, 0, 0, size, -1, 0, 0, 1, 0),
    SMD.createVertex(0, 0, 0, 0, -1, 0, 0, 0, 0),
    SMD.createVertex(0, 0, size, size, -1, 0, 0, 1, 1)
  );
  smd.addTriangle(material,
    SMD.createVertex(0, 0, 0, 0, -1, 0, 0, 0, 0),
    SMD.createVertex(0, 0, size, 0, -1, 0, 0, 1, 1),
    SMD.createVertex(0, 0, size, size, -1, 0, 0, 0, 1)
  );

  // Right
  smd.addTriangle(material,
    SMD.createVertex(0 ,size, 0, size, 1, 0, 0, 1, 0),
    SMD.createVertex(0, size, 0, 0, 1, 0, 0, 0, 0),
    SMD.createVertex(0, size, size, size, 1, 0, 0, 1, 1)
  );
  smd.addTriangle(material,
    SMD.createVertex(0, size, 0, 0, 1, 0, 0, 0, 0),
    SMD.createVertex(0, size, size, 0, 1, 0, 0, 1, 1),
    SMD.createVertex(0, size, size, size, 1, 0, 0, 0, 1)
  );

  return smd;
}

let smd = createCube(64);
fs.writeFileSync("test_cube.smd", smd.export());