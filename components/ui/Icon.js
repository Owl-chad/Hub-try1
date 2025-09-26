import React from 'react';

const Icon = ({ name, className = 'w-6 h-6', isFilled = false }) => {
  const icons = {
    home: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" })
      )
    ),
    explore: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('circle', { cx: "11", cy: "11", r: "8" }), React.createElement('line', { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
      )
    ),
    add: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('rect', { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }), React.createElement('line', { x1: "12", y1: "8", x2: "12", y2: "16" }), React.createElement('line', { x1: "8", y1: "12", x2: "16", y2: "12" })
      )
    ),
    heart: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('path', { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
      )
    ),
    messages: (
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement('path', { d: "m21 15-4-4a2 2 0 0 0-2.82 0L8 17.17a2 2 0 0 1-2.83 0L2 14.34V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }), React.createElement('path', { d: "m7 14 5-5 5.5 5.5" }), React.createElement('path', { d: "m22 14-4.5-4.5" })
        )
    ),
    comment: (
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement('path', { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
        )
    ),
    send: (
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement('line', { x1: "22", y1: "2", x2: "11", y2: "13" }), React.createElement('polygon', { points: "22 2 15 22 11 13 2 9 22 2" })
        )
    ),
    gantt: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M15 5v14" }), React.createElement('path', { d: "M8 12v7" }), React.createElement('path', { d: "M22 5v14" }))
    ),
    raic: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }), React.createElement('polyline', { points: "14 2 14 8 20 8" }), React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13" }), React.createElement('line', { x1: "16", y1: "17", x2: "8", y2: "17" }), React.createElement('line', { x1: "10", y1: "9", x2: "8", y2: "9" }))
    ),
    dashboard: (
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('rect', { x: "3", y: "3", width: "7", height: "9" }), React.createElement('rect', { x: "14", y: "3", width: "7", height: "5" }), React.createElement('rect', { x: "14", y: "12", width: "7", height: "9" }), React.createElement('rect', { x: "3", y: "16", width: "7", height: "5" }))
    ),
    tools: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }))
    ),
    plus: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, React.createElement('line', { x1: "12", y1: "5", x2: "12", y2: "19" }), React.createElement('line', { x1: "5", y1: "12", x2: "19", y2: "12" }))
    ),
    question: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('circle', { cx: "12", cy: "12", r: "10" }), React.createElement('path', { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }), React.createElement('line', { x1: "12", y1: "17", x2: "12.01", y2: "17" }))
    ),
    lightbulb: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: isFilled ? 'currentColor' : 'none', stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 2a7 7 0 0 0-7 7c0 2.05 1.03 3.82 2.56 4.94L6 18h12l-1.56-4.06A7 7 0 0 0 12 2z" }), React.createElement('path', { d: "M9 20h6" }), React.createElement('path', { d: "M12 22v-2" }))
    ),
    upload: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), React.createElement('polyline', { points: "17 8 12 3 7 8" }), React.createElement('line', { x1: "12", y1: "3", x2: "12", y2: "15" }))
    ),
    edit: (
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            React.createElement('path', { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
            React.createElement('path', { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
        )
    ),
    trash: (
      React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('polyline', { points: "3 6 5 6 21 6" }),
        React.createElement('path', { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
        React.createElement('line', { x1: "10", y1: "11", x2: "10", y2: "17" }),
        React.createElement('line', { x1: "14", y1: "11", x2: "14", y2: "17" })
      )
    ),
  };

  return React.createElement('div', { className: className }, icons[name]);
};

export default Icon;
