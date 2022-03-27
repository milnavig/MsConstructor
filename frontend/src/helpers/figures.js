import * as go from 'gojs';

var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);

export function dbFigure(shape, w, h) {
  var geo = new go.Geometry();
  var cpxOffset = KAPPA * .5;
  var cpyOffset = KAPPA * .1;
  var fig = new go.PathFigure(w, .1 * h, true);
  geo.add(fig);

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, .9 * h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, h, w, (.9 + cpyOffset) * h,
    (.5 + cpxOffset) * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, .9 * h, (.5 - cpxOffset) * w, h,
    0, (.9 + cpyOffset) * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .1 * h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, 0, 0, (.1 - cpyOffset) * h,
    (.5 - cpxOffset) * w, 0));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, .1 * h, (.5 + cpxOffset) * w, 0,
    w, (.1 - cpyOffset) * h));
  var fig2 = new go.PathFigure(w, .1 * h, false);
  geo.add(fig2);
  // Rings
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, .2 * h, w, (.1 + cpyOffset) * h,
    (.5 + cpxOffset) * w, .2 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, .1 * h, (.5 - cpxOffset) * w, .2 * h,
    0, (.1 + cpyOffset) * h));
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, .2 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, .3 * h, w, (.2 + cpyOffset) * h,
    (.5 + cpxOffset) * w, .3 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, .2 * h, (.5 - cpxOffset) * w, .3 * h,
    0, (.2 + cpyOffset) * h));
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, .3 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, .4 * h, w, (.3 + cpyOffset) * h,
    (.5 + cpxOffset) * w, .4 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, .3 * h, (.5 - cpxOffset) * w, .4 * h,
    0, (.3 + cpyOffset) * h));
  geo.spot1 = new go.Spot(0, .4);
  geo.spot2 = new go.Spot(1, .9);
  return geo;
};

export function keyFigure(shape, w, h) {
  var geo = new go.Geometry();
  var fig = new go.PathFigure(w * 1, h * .5, true);
  geo.add(fig);
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .90, .40 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .50, .40 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .50, .35 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .45, .35 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .30, .20 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .15, .20 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .35 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .65 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .15, .80 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .30, .80 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .45, .65 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .50, .65 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .50, .6 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .60, .6 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .65, .55 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .70, .6 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .75, .55 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .80, .6 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .85, .575 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .9, 0.60 * h).close());
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.17 * w, 0.425 * h));
  fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 360, 0.17 * w, 0.5 * h, 0.075 * w, 0.075 * h).close());
  return geo;
};
