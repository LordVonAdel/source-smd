/**
 * Filetype documented here:
 * https://developer.valvesoftware.com/wiki/Studiomdl_Data
 */

const SMDError = require("./SMDError.js");
const SMD_HEADER = "version 1\n";

/**
 * StudioMDL class. Instances of this class represent models.
 */
class SMD {

  /**
   * Creates a new model
   */
  constructor() {
    this.nodes = [new Node(0, "root", -1)];
    this.triangles = [];
    this.skeleton = [];
    this.vertexAnimation = [];
  }

  /**
   * Adds a triangle to the model
   * @param {String} material 
   * @param {Vertex} vertex1 
   * @param {Vertex} vertex2 
   * @param {Vertex} vertex3 
   * @returns {void}
   */
  addTriangle(material, vertex1, vertex2, vertex3) {
    this.triangles.push(new Triangle(material, vertex1, vertex2, vertex3));
  }

  /**
   * Adds an animation keyframe for bones. Multiple keys can be set in the same frame by calling this function again with the same time.
   * @param {} time 
   * @param {*} boneId 
   * @param {*} posX X-Position of the bone at that time
   * @param {*} posY Y-Position of the bone at that time
   * @param {*} posZ Z-Position of the bone at that time
   * @param {*} rotX X-Rotation of the bone at that time
   * @param {*} rotY Y-Rotation of the bone at that time
   * @param {*} rotZ Z-Rotation of the bone at that time
   * @returns {void}
   */
  addSkeleton(time, boneId, posX, posY, posZ, rotX, rotY, rotZ) {
    this.skeleton.push({time, boneId, pos: [posX, posY, posZ], rot: [rotX, rotY, rotZ]});
  }

  /**
   * Adds four triangles from four vertices as double sided quad.
   * @param {String} material Material to use for the triangles
   * @param {Vertex} vertex1 Vertex1
   * @param {Vertex} vertex2 Vertex2
   * @param {Vertex} vertex3 Vertex3
   * @param {Vertex} vertex4 Vertex4
   * @returns {void}
   */
  addQuad(material, vertex1, vertex2, vertex3, vertex4) {
    this.addTriangle(material, vertex1, vertex2, vertex3);
    this.addTriangle(material, vertex3, vertex2, vertex1);
    this.addTriangle(material, vertex1, vertex3, vertex4);
    this.addTriangle(material, vertex1, vertex4, vertex3);
  }

  /**
   * Adds a node
   * @param {*} name Name of the node
   * @param {*} parent Parent node id
   * @returns {Number} Id of the newly added node
   */
  addNode(name, parent) {
    let id = this.nodes.length;
    this.nodes.push(new Node(id, name, parent));
    return id;
  }

  /**
   * Gets the ID of an node by name
   * @param {String} name Name of the targeted node
   * @returns {Number} Id of the node or -1 when not found
   */
  getNodeIdByName(name) {
    let n = this.nodes.find(n => n.boneName == name);
    if (n) return n.id;
    return -1;
  }

  /**
   * Loads the content from a SMD file into this object
   * @param {String} content 
   * @returns {void}
   */
  import(content) {
    let lines = content.split("\n").filter(line => !line.startsWith("//")).map(line => line.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim());
    if (lines[0] != SMD_HEADER.split("\n")[0]) throw new SMDError("Unknown SMD version!", 1, lines[0]);

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];
      if (line == "nodes") {
        i = this._importNodes(lines, i);
      } else if (line == "skeleton") {
        i = this._importSekeleton(lines, i);
      } else if (line == "triangles") {
        i = this._importTriangles(lines, i);
      } else if (line == "vertexanimation") {
        i = this._importVertexAnimation(lines, i);
      }
    }
  }

  _importNodes(lines, lineNumber) {
    while (lines[++lineNumber] != "end") {
      let line = lines[lineNumber];
      if (lineNumber >= lines.length) throw new SMDError("SMD Data Corrupted: Nodes block does not end", lineNumber+1, line);
      let values = customStringSplit(line);
      if (values.length != 3) throw new SMDError("SMD Data Corrupted: Expected 3 values in line " + lineNumber+1, lineNumber+1, line);
      let id = +values[0];
      let name = values[1];
      let parent = +values[2];
      this.nodes[id] = new Node(id, name, parent);
    }
    return lineNumber;
  }

  _importSekeleton(lines, lineNumber) {
    let time = 0;
    while (lines[++lineNumber] != "end") {
      let line = lines[lineNumber];
      if (lineNumber >= lines.length) throw new SMDError("SMD Data Corrupted: Skeleton block does not end", lineNumber+1, line);
      let values = line.split(" ");
      if (values[0] == "time") {
        time = +values[1];
      } else {
        if (values.length != 7) throw new SMDError("SMD Data Corrupted: Expected 7 values in line " + lineNumber+1, lineNumber+1, line);
        //values: [BoneID, posX, posY, posZ, rotX, rotY, rotZ]
        this.addSkeleton(time, ...values);
      }
    }
    return lineNumber;
  }

  _importTriangles(lines, lineNumber) {
    while (lines[++lineNumber] != "end") {
      if ((lineNumber+4) >= lines.length) throw new SMDError("SMD Data Corrupted: Triangles block does not end", lineNumber+1, line);
      
      let material = lines[lineNumber];
      let vertex1 = lines[lineNumber+1].split(" ");
      let vertex2 = lines[lineNumber+2].split(" ");
      let vertex3 = lines[lineNumber+3].split(" ");

      this.addTriangle(material, SMD.createVertex(...vertex1), SMD.createVertex(...vertex2), SMD.createVertex(...vertex3));
      lineNumber+=3;
    }
    return lineNumber;
  }

  _importVertexAnimation(lines, lineNumber) {
    while (lines[++lineNumber] != "end") {
      if (lineNumber >= lines.length) throw new SMDError("SMD Data Corrupted: Vertex Animation block does not end", lineNumber+1, line);
    }
    return lineNumber;
  }

  /**
   * Returns a string of the content for the .smd file
   * @returns {String} Content of the SMD file
   */
  export() {
    return SMD_HEADER
    + this._exportNodes()
    + this._exportSkeleton()
    + this._exportTriangles()
    + this._exportVertexAnimation()
  }

  _exportNodes() {
    let str = "nodes\n";
    for (let node of this.nodes) {
      str += node.export();
    }
    return str + "end\n";
  }

  _exportSkeleton() {
    let str = "skeleton\n";
    this.skeleton.sort((a, b) => a.time - b.time);
    let lastTime = null;
    for (let sk of this.skeleton) {
      if (sk.time != lastTime) {
        str += "time " + sk.time + "\n";
      }
      str += sk.boneId + " " + sk.pos.join(" ") + " " + sk.rot.join(" ") + "\n";
      lastTime = sk.time;
    }
    return str + "end\n";
  }

  _exportTriangles() {
    let str = "triangles\n";
    for (let t of this.triangles) {
      str += t.export();
    }
    return str + "end\n";
  }

  _exportVertexAnimation() {
    if (this.vertexAnimation.length == 0) return "";

    /**
     * @todo Implement vertex animations
     */
    throw new Error("Vertex animations not implemented!");

    let str = "vertexanimation\n";
    return str + "end\n";
  }

  /**
   * Loads the content from an obj file into this object.
   * Does only work with triangulated meshes!
   * @param {String} objData 
   * @returns {void}
   */
  importObj(objData) {
    let lines = objData.split("\n");

    let vertices = [];
    let texcoords = [];
    let normals = [];

    let currentMaterial = "";
    let currentNode = null;

    for (let line of lines) {
      let blocks = line.split(" ");

      switch (blocks[0]) {
        case "usemtl":
          currentMaterial = blocks[1];
          break;
        case "o":
          currentNode = this.addNode(blocks[1], 0);
          break;
        case "v":
          vertices.push([+blocks[1], +blocks[2], +blocks[3]]);
          break;
        case "vt":
          texcoords.push([+blocks[1], +blocks[2]]);
          break;
        case "vn":
          normals.push([+blocks[1], +blocks[2], +blocks[3]]);
          break;
        case "f":
          let smdVerts = [];
          for (let i = 1; i <= 3; i++) {
            let vertexString = blocks[i];
            let splitted = vertexString.split("/");
            
            let position = vertices[+splitted[0] - 1];
            let texcoord = texcoords[+splitted[1] - 1];
            let normal = normals[+splitted[2] - 1];

            smdVerts.push(SMD.createVertex(currentNode, ...position, ...normal, ...texcoord));
          }
          this.addTriangle(currentMaterial, ...smdVerts);
          break;
      }
    }
  }

  /**
   * Creates a vertex
   * @param {Number} parentBone Id of the parent bone
   * @param {Number} x X Position in units
   * @param {Number} y Y Position in units
   * @param {Number} z Z Position in units
   * @param {Number} nx NormalX
   * @param {Number} ny NormalY
   * @param {Number} nz NormalZ
   * @param {Number} u 
   * @param {Number} v 
   * @returns {Vertex} The created vertex
   */
  static createVertex(parentBone, x, y, z, nx, ny, nz, u, v) {
    return [parentBone, x, y, z, nx, ny, nz, u, v];
  }

  /**
   * Creates a mesh with default skeleton
   * @returns {SMD} The created smd
   */
  static createSimple() {
    let smd = new SMD();
    smd.addSkeleton(0, 0, 0, 0, 0, 0, 0, 0);
    return smd;
  }

  /**
   * Creates a mesh from the content of a SMD file
   * @param {String} content The SMD content
   * @returns {SMD} The created smd
   */
  static fromContent(content) {
    let smd = new SMD();
    smd.import(content);
    return smd;
  }

  /**
   * Creates a mesh from the content of an obj file
   * @param {String} content The obj file content
   */
  static fromObj(content) {
    let smd = new SMD();
    smd.importObj(content);
    return smd;
  }

}

module.exports = SMD;

/**
 * =============================================
 * Classes not accessible from outside this file
 * =============================================
 */

 /**
  * Represents a Node
  */
class Node {

  constructor(id, boneName, parent = -1) {
    this.id = id;
    this.boneName = boneName;
    this.parent = parent;
  }

  export() {
    return this.id + ' "' + this.boneName + '" ' + this.parent + "\n";
  }

}

/**
 * Represents a triangle
 */
class Triangle {

  constructor(material, vertex1, vertex2, vertex3) {
    this.material = material;
    this.vertices = [vertex1, vertex2, vertex3];
  }

  export() {
    return this.material + "\n"
    + this.vertices[0].join(" ") + "\n"
    + this.vertices[1].join(" ") + "\n"
    + this.vertices[2].join(" ") + "\n";
  }

}

/**
 * Splits an string at spaces, ignoring while in string literal
 */
function customStringSplit(str) {
  const literalChar = '"';
  const splitter = " ";
  let inLiteral = false;

  let out = [];
  let block = "";

  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char == literalChar) {
      inLiteral = !inLiteral;
      continue;
    }
    if (char == splitter) {
      out.push(block);
      block = "";
      continue;
    }
    block += char;
  }
  out.push(block);

  return out;
}