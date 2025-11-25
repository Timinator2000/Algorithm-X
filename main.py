def define_env(env):
    "Add custom macros to MkDocs."

    @env.macro
    def youtube(video_id, title="Watch on YouTube"):
        return f"""
<div class="youtube-thumb" style="text-align:center;">
  <a href="https://www.youtube.com/watch?v={video_id}" target="_blank" style="position:relative; display:inline-block; text-decoration:none;">
    <img src="https://img.youtube.com/vi/{video_id}/hqdefault.jpg" alt="{title}" style="width:100%; max-width:560px; height:auto;">
    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 68 48">
        <path d="M66.52,7.74a8,8,0,0,0-11.27-2.83L2.43,25.68A8,8,0,0,0,2.43,38.3L55.25,61.09A8,8,0,0,0,66.52,58.26Z" fill="white" transform="translate(-2.43 -4)"/>
        <path d="M45,24 27,14 27,34Z" fill="red"/>
      </svg>
    </div>
  </a>
  <p><em>{title}</em></p>
</div>
"""
    

    @env.macro
    def classbox(name, attributes="", methods=""):
        """
        Render a UML-style class box with optional attributes and methods.
        """
        attr_html = ""
        if attributes.strip():
            attr_lines = attributes.strip().split("\n")
            attr_html = "".join(f"<div class='uml-attr'>{line}</div>" for line in attr_lines)

        method_html = ""
        if methods.strip():
            method_lines = methods.strip().split("\n")
            method_html = "".join(f"<div class='uml-method'>{line}</div>" for line in method_lines)

        return f"""
<div class='uml-class'>
  <div class='uml-class-name'>{name}</div>
  {f"<div class='uml-class-section'>{attr_html}</div>" if attr_html else ""}
  {f"<div class='uml-class-section'>{method_html}</div>" if method_html else ""}
</div>
"""

    @env.macro
    def classrelation(left, right):
        """
        Render a straight line connecting two classes.
        """
        return f"""
<div class='uml-relation'>
  <div class='uml-relation-left'>{left}</div>
  <div class='uml-relation-line'></div>
  <div class='uml-relation-right'>{right}</div>
</div>
"""
