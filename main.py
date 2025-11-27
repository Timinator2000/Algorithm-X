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
    def classbox(name, attributes="", methods="", header_class="uml-header"):
        """
        Returns HTML for a single class box.

        header_class: "uml-header" (amber), "uml-header-violet", or "uml-header-teal"
        attributes / methods: newline-separated strings
        """
        attrs_html = "<br>".join(line for line in attributes.strip().splitlines()) if attributes else ""
        methods_html = "<br>".join(line for line in methods.strip().splitlines()) if methods else ""

        html = f"""<div class="uml-box">
      <div class="{header_class}">{name}</div>
    """
        if attrs_html:
            html += f'  <div class="uml-section">{attrs_html}</div>\n'
        if methods_html:
            html += f'  <div class="uml-section">{methods_html}</div>\n'
        html += "</div>"
        return html


    @env.macro
    def classrow(*boxes_html):
        """
        Arrange class boxes horizontally with fixed-width connectors.
        Outer container scrolls fully on narrow screens, row centers on wider viewports.
        """
        parts = []
        n = len(boxes_html)
        for i, b in enumerate(boxes_html):
            parts.append(f'<div class="uml-cell">{b}</div>')
            if i < n - 1:
                parts.append('<div class="uml-connector"><div class="uml-line"></div></div>')

        row_html = (
            '<div class="uml-row-outer">\n'
            '    <div class="uml-row">\n'
            + "\n".join(parts) +
            '\n    </div>\n'
            '</div>'
        )
        return row_html

