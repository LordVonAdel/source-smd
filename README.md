# source-smd
Package that works with Studiomdl Data

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