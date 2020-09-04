# source-smd
This module provides a class which instances can be used to define 3D models. These models can then be exported as SMD. SMD files together with a QC file can be used to compile them into source engine compatible models with StudioSMD.

## Usage
Example:
```javascript
const SMD = require("source-smd");
const fs = require("fs");

let smd = new SMD();
smd.addSkeleton(0, 0, 0, 0, 0, 0, 0, 0);

// Front
smd.addTriangle("test_material",
  SMD.createVertex(0, size, 0, 0, 0, 0, -1, 1, 0),
  SMD.createVertex(0, 0, 0, 0, 0, 0, -1, 0, 0),
  SMD.createVertex(0, size, size, 0, 0, 0, -1, 1, 1)
);

// [...] Add more triangles here

smd.addTriangle("test_material",
  SMD.createVertex(0, size, 0, 0, 1, 0, 0, 0, 0),
  SMD.createVertex(0, size, size, 0, 1, 0, 0, 1, 1),
  SMD.createVertex(0, size, size, size, 1, 0, 0, 0, 1)
);

fs.writeFileSync("test_cube.smd", smd.export());
```
