"""Blender 4.x scene setup for CFrank Group Hero (v4.0). Run: blender --python setup_blender_scene.py"""
import bpy, math
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath="cfrank_house_model.obj")
world = bpy.data.worlds.new("CFrank_World")
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg: bg.inputs[0].default_value = (0.071, 0.082, 0.094, 1.0)
cam_d = bpy.data.cameras.new("IsoCamera"); cam_d.type = "ORTHO"; cam_d.ortho_scale = 14.0
cam = bpy.data.objects.new("IsoCamera", cam_d)
bpy.context.collection.objects.link(cam); bpy.context.scene.camera = cam
cam.location = (22, -22, 18); cam.rotation_euler = (math.radians(60), 0, math.radians(45))
bpy.context.scene.render.resolution_x = 1920; bpy.context.scene.render.resolution_y = 1080
print("Scene ready.")
