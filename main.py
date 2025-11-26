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
        Returns HTML for a single class box.
        attributes / methods: newline-separated strings (i.e. "a\nb\nc")
        """
        attrs_html = ""
        if attributes and attributes.strip():
            attrs_html = "<br>".join(line for line in attributes.strip().splitlines())

        methods_html = ""
        if methods and methods.strip():
            methods_html = "<br>".join(line for line in methods.strip().splitlines())

        html = f"""<div class="uml-box">
  <div class="uml-header">{name}</div>
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
        Arrange N class boxes with connecting lines that stretch between them.
        """
        parts = []
        n = len(boxes_html)
        for i, b in enumerate(boxes_html):
            parts.append(f'<div class="uml-cell">{b}</div>')
            if i < n - 1:
                parts.append('<div class="uml-connector"><div class="uml-line"></div></div>')
        return '<div class="uml-row">\n' + "\n".join(parts) + '\n</div>'


    # @env.macro
    # def classrow(*boxes_html, line_width=60):
    #     """
    #     Arrange one or more already-rendered classbox HTML strings horizontally.
    #     Example:
    #         classrow(box1_html, box2_html, box3_html, line_width=80)
    #     Returns a single HTML string (remember to use | safe when rendering).
    #     """
    #     # sanitize/ensure inputs are strings
    #     parts = []
    #     n = len(boxes_html)
    #     for i, b in enumerate(boxes_html):
    #         # wrap each class in a .uml-cell
    #         parts.append(f'<div class="uml-cell">{b}</div>')
    #         # insert a line between cells (N-1 lines for N boxes)
    #         if i < n - 1:
    #             parts.append(f'<div class="uml-line" style="width:{int(line_width)}px;"></div>')

    #     row_html = '<div class="uml-row">\n' + "\n".join(parts) + "\n</div>"
    #     return row_html
