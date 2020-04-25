/**
 * Filetype documented here:
 * https://developer.valvesoftware.com/wiki/Studiomdl_Data
 */

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
   */
  addSkeleton(time, boneId, posX, posY, posZ, rotX, rotY, rotZ) {
    this.skeleton.push({time, boneId, pos: [posX, posY, posZ], rot: [rotX, rotY, rotZ]});
  }

  /**
   * Adds four triangles from four vertices as double sided quad.
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
   * Returns a string of the content for the .smd file
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
