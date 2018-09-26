import os
import re
import cherrypy
import json
import pandas as pd
import urllib2
cherrypy.config.update({"server.socket_port": 8000})

# ========================== Constant declarations ============================

# Locations of svg field layouts
SVG_LAYOUTS_FOLDER = "./layouts"
# Location of the default field layout
SVG_DEFAULT_LAYOUT = os.path.join(SVG_LAYOUTS_FOLDER, "default.svg")
SVG_BASEBALL = os.path.join(SVG_LAYOUTS_FOLDER, "baseball.svg")

# =============================== Server Class ================================
class BaseballSchemaServer:
    # Function that takes as input a base path, game_pk and play_id, and returns the tracking and meta 
    # data loaded from the local machine 
    @cherrypy.expose
    def get_data(self, path):
        path = urllib2.unquote(path)
        print path
        tracking_csv = pd.read_csv(path, skiprows=[0], sep=";")
        svg_field = self.get_stadium_svg(int(0))
        metadata = pd.DataFrame([])
        ret = {
            "tracking": tracking_csv.to_json(orient = "records"),
            "metadata": metadata.to_json(orient = "records"),
            "svg_field": svg_field,
            "svg_baseball": self.get_baseball_svg()
        }
        return json.dumps(ret)

    # Function that takes as input stadium_id and returns the stadium SVG string.
    def get_stadium_svg(self, stadium_id):
        def recolor(string):
            string = string.replace("#A98C48", "#DDD").replace("#A88B49", "#DDD").replace("#68836A", "#CCC").replace("#AA8D43", "#DDD")
            return string
        layout_svg_filename = os.path.join(SVG_LAYOUTS_FOLDER, str(stadium_id) + ".svg")
        if stadium_id == 2394:
            with open(SVG_DEFAULT_LAYOUT, "r") as f:
                return recolor("".join(f.readlines()[1:-1])) # removing first and last line of file: <svg> tag
        try:
            with open(layout_svg_filename, "r") as f:
                return recolor("".join(f.readlines()[1:-1])) # removing first and last line of file: <svg> tag
        except IOError: # File not found
            with open(SVG_DEFAULT_LAYOUT, "r") as f:
                return recolor("".join(f.readlines()[1:-1])) # removing first and last line of file: <svg> tag

    def get_baseball_svg(self):
        with open(SVG_BASEBALL, "r") as f:
            return "".join(f.readlines()[1:-1]) # removing first and last line of file: <svg> tag
    
# =================================== Main ====================================
if __name__ == "__main__":
    conf = { "/":
                { 
                    "tools.staticdir.on" : True,
                    "tools.staticdir.dir" : os.path.abspath(os.path.dirname(__file__)),
                    "tools.staticdir.index" : "index.html",
                    "tools.sessions.on": False,
                } 
            }
    cherrypy.quickstart( BaseballSchemaServer(), config = conf )