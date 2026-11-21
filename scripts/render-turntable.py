"""Render one frame of the plush dinosaur that turns on the home page.

   blender -b -P scripts/render-turntable.py -- <out.png> [degrees turned] [resolution] [samples]

Render 32 frames (0, 11.25, ... degrees) as 00.png ... 31.png, then run scripts/pack-turntable.py on the folder.
The coat, belly and trim colours are the three constants below.
"""
import math, sys
import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
OUT = argv[0]
TURN = math.radians(float(argv[1])) if len(argv) > 1 else 0
RES = int(argv[2]) if len(argv) > 2 else 640
SAMPLES = int(argv[3]) if len(argv) > 3 else 48

COAT, BELLY, TRIM = "#7fd0a8", "#f6ecd2", "#ff7d5c"

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def srgb(hex_):
    h = hex_.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1]

def fur_material(name, colour):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    hair = nt.nodes.new("ShaderNodeBsdfHairPrincipled")
    hair.parametrization = "COLOR"
    hair.inputs["Color"].default_value = colour
    for key, value in (("Roughness", 0.55), ("Radial Roughness", 0.7), ("Random Color", 0.12), ("Random Roughness", 0.2)):
        if key in hair.inputs: hair.inputs[key].default_value = value
    nt.links.new(hair.outputs[0], out.inputs["Surface"])
    return m

def cloth_material(name, colour, rough=0.9, sheen=0.6):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = colour
    b.inputs["Roughness"].default_value = rough
    b.inputs["Sheen Weight"].default_value = sheen
    return m

colours = {"coat": srgb(COAT), "belly": srgb(BELLY)}
fur = {key: fur_material("fur-" + key, c) for key, c in colours.items()}
skin = {key: cloth_material("skin-" + key, [x * 0.75 for x in c[:3]] + [1]) for key, c in colours.items()}
felt = cloth_material("felt", srgb(TRIM), 0.95, 0.8)
blush = cloth_material("blush", srgb("#f59aa5"), 0.9, 0.6)
ribbon = cloth_material("ribbon", srgb("#ffd046"), 0.55, 0.3)
thread = cloth_material("thread", srgb("#1b1512"), 0.8, 0.4)
bead = cloth_material("bead", srgb("#1b1512"), 0.08, 0)
shine = cloth_material("shine", srgb("#ffffff"), 0.3, 0)

def part(name, loc, scale, rot=(0, 0, 0), colour="coat", length=0.05, density=3400):
    """A stuffed ellipsoid with a coat of plush."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, location=loc, rotation=rot)
    ob = bpy.context.object; ob.name = name
    ob.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.shade_smooth()
    ob.data.materials.append(skin[colour]); ob.data.materials.append(fur[colour])
    area = sum(p.area for p in ob.data.polygons)
    ps = ob.modifiers.new("fur", "PARTICLE_SYSTEM").particle_system.settings
    ps.type = "HAIR"; ps.count = int(area * density)
    ps.hair_length = length; ps.hair_step = 4
    ps.length_random = 0.35
    ps.child_type = "INTERPOLATED"; ps.rendered_child_count = 36; ps.child_percent = 4
    ps.clump_factor = 0.25; ps.clump_shape = 0.2
    ps.roughness_1 = 0.035; ps.roughness_1_size = 0.6; ps.roughness_endpoint = 0.07; ps.roughness_2 = 0.03
    ps.child_length = 1; ps.brownian_factor = 0.02
    ps.root_radius = 0.9; ps.tip_radius = 0.25; ps.radius_scale = 0.008
    ps.material = 2
    ps.use_hair_bspline = True
    if hasattr(ps, "render_step"): ps.render_step = 3
    return ob

def solid(name, loc, scale, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, location=loc, rotation=rot)
    ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.shade_smooth(); ob.data.materials.append(mat)
    return ob

# The dinosaur, sitting, facing -Y.
part("body", (0, 0, 0.78), (0.64, 0.56, 0.74))
part("head", (0, -0.02, 1.80), (0.62, 0.56, 0.52))
part("snout", (0, -0.40, 1.68), (0.37, 0.27, 0.25), length=0.04, density=3600)
part("belly", (0, -0.34, 0.84), (0.40, 0.25, 0.50), colour="belly", length=0.03, density=3600)
for sx in (-1, 1):
    part("arm", (sx * 0.68, -0.18, 1.0), (0.19, 0.19, 0.38), rot=(0.45, math.radians(sx * 30), 0))
    part("leg", (sx * 0.42, -0.52, 0.27), (0.27, 0.46, 0.27), rot=(0, 0, math.radians(sx * 14)))
    part("pad", (sx * 0.52, -0.95, 0.28), (0.18, 0.04, 0.18), rot=(0, 0, math.radians(sx * 14)), colour="belly", length=0.03, density=3600)
    solid("eye", (sx * 0.27, -0.525, 1.90), (0.095, 0.07, 0.105), bead)
    solid("glint", (sx * 0.27 - 0.03, -0.592, 1.94), (0.024, 0.012, 0.024), shine)
    solid("cheek", (sx * 0.44, -0.435, 1.71), (0.09, 0.035, 0.07), blush, rot=(0, 0, math.radians(sx * 35)))
    solid("nostril", (sx * 0.09, -0.70, 1.77), (0.028, 0.02, 0.036), thread)

# The tail curls out to one side, so it shows from the front as well.
for i, (loc, scale) in enumerate([
    ((0, 0.52, 0.36), (0.36, 0.42, 0.32)),
    ((0.10, 0.92, 0.27), (0.27, 0.36, 0.24)),
    ((0.30, 1.24, 0.21), (0.19, 0.28, 0.17)),
    ((0.52, 1.44, 0.17), (0.12, 0.18, 0.11)),
]):
    part("tail-%d" % i, loc, scale, rot=(0, 0, math.radians(-12 * i)))

# Felt plates from the brow, over the head, down the back and along the tail.
for loc, size in [
    ((0, -0.20, 2.37), 0.15), ((0, 0.12, 2.40), 0.19), ((0, 0.42, 2.18), 0.17),
    ((0, 0.58, 1.72), 0.15), ((0, 0.62, 1.30), 0.18), ((0, 0.70, 0.90), 0.17),
    ((0.04, 0.92, 0.58), 0.14), ((0.22, 1.20, 0.42), 0.11), ((0.44, 1.42, 0.30), 0.08),
]:
    solid("plate", loc, (0.085, size, size), felt)

# Embroidered smile.
cu = bpy.data.curves.new("mouth", "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = 0.014
pts = [(-0.16, -0.672, 1.63), (-0.085, -0.70, 1.59), (0, -0.712, 1.575), (0.085, -0.70, 1.59), (0.16, -0.672, 1.63)]
sp = cu.splines.new("NURBS"); sp.points.add(len(pts) - 1); sp.use_endpoint_u = True; sp.order_u = 3
for p, co in zip(sp.points, pts): p.co = (*co, 1)
mouth = bpy.data.objects.new("mouth", cu); scene.collection.objects.link(mouth); cu.materials.append(thread)

# A ribbon at the neck.
bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.06, location=(0, -0.03, 1.37), major_segments=64, minor_segments=24)
band = bpy.context.object; band.scale = (1, 0.94, 0.75); bpy.ops.object.shade_smooth(); band.data.materials.append(ribbon)
for sx in (-1, 1):
    solid("bow", (sx * 0.15, -0.47, 1.33), (0.15, 0.05, 0.10), ribbon, rot=(0, math.radians(sx * 18), 0))
solid("knot", (0, -0.49, 1.34), (0.055, 0.05, 0.06), ribbon)

# Ground that only receives shadows.
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
bpy.context.object.is_shadow_catcher = True

def orbit(loc):
    """The camera and lights circle the toy together, which reads as the toy turning on the spot."""
    x, y, z = loc
    return (x * math.cos(TURN) + y * math.sin(TURN), y * math.cos(TURN) - x * math.sin(TURN), z)

def light(loc, energy, size, colour=(1, 1, 1)):
    d = bpy.data.lights.new("l", "AREA"); d.energy = energy; d.size = size; d.color = colour
    o = bpy.data.objects.new("l", d); scene.collection.objects.link(o); o.location = orbit(loc)
    o.rotation_euler = (Vector((0, 0, 1.2)) - o.location).to_track_quat("-Z", "Y").to_euler()

light((-3.2, -4.5, 5.2), 620, 4.5, (1, 0.97, 0.92)); light((4.5, -3.5, 2.2), 150, 6, (0.95, 0.97, 1)); light((1.5, 4.5, 4.5), 500, 3)

world = bpy.data.worlds.new("w"); scene.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = srgb("#fff5e1")
world.node_tree.nodes["Background"].inputs[1].default_value = 0.35

cam = bpy.data.cameras.new("cam"); cam.lens = 112
co = bpy.data.objects.new("cam", cam); scene.collection.objects.link(co); scene.camera = co
target = Vector((0, 0, 1.2))
co.location = orbit((0, -11.5, 1.2 + 1.3))
co.rotation_euler = (target - co.location).to_track_quat("-Z", "Y").to_euler()

scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"; scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.use_adaptive_sampling = True; scene.cycles.adaptive_threshold = 0.03
scene.cycles_curves.shape = "RIBBONS"
scene.render.film_transparent = True
scene.render.resolution_x = RES; scene.render.resolution_y = RES
scene.view_settings.view_transform = "Standard"
scene.render.image_settings.file_format = "PNG"; scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = OUT
bpy.ops.render.render(write_still=True)
