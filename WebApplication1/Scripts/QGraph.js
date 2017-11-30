

     function FindMaxValue(AnArray) {
         var is2DArray = false;
         var max = 0;
         // check if array of arrays
         if (AnArray[0].length) {
             max = AnArray[0][0]
             is2DArray = true;
         } else {
             max = AnArray[0];
         }
         for (var i = 0; i < AnArray.length; i++) {
             if (is2DArray) {
                 for (var j = 0; j < AnArray[i].length; j++) {
                     temp = AnArray[i][j];
                     if (temp > max) { max = temp }
                 }
             } else {
                 if (AnArray[i] > max) {max = AnArray[i] }
             }
         }
         return max;
     }

function FindMinValue(AnArray)
{
    var is2DArray = false;
    var Min = 0;
    // check if array of arrays
    if (AnArray[0].length) {
        Min = AnArray[0][0]
        is2DArray = true;
    } else {
        Min = AnArray[0];
    }
    for (var i = 0; i < AnArray.length; i++) {
        if (is2DArray) {
            for (var j = 0; j < AnArray[i].length; j++) {
                if (AnArray[i][j] < Min) { Min = AnArray[i][j] }
            }
        } else {
            if (AnArray[i] < Min) { Min = AnArray[i] }
        }
    }
    return Min;             
}


function FindInterval(min, max, NumberOfTics) {
    var interval = 0;
    var range = max - min;
    if (range < 0)
        range = range * -1;
    if (NumberOfTics < 2) {
        interval = max
    }
    else {
        interval = range / (NumberOfTics -1);
    }
    return interval
}

function FormatNumber(value, precision) {
    var ValStr = value.toString();
    if (typeof (value) == "number") {
        var index = ValStr.indexOf(".");
        if (index > -1) {
            var temp = ValStr.substring(0, index + 1 + precision)

            if (index = 0) {
                temp = "0" + temp;
            }
        }
        else {
            temp = ValStr;
        }
    }
    return temp;
}

function point(anX, aY) {
    this.X = anX;
    this.Y = aY;
}

function LineGraph(TheCanvas, XLabel, XAxisPrecision, YLabel, YAxisPrecision, Title, ContBackColor, GraphBackColor) {
    this.isError = true;
    this.ErrMessage = "";
    var CV = null;
    var ctx = null;
    if (typeof (TheCanvas) == "string") {
        CV = document.getElementById(TheCanvas);
        if (CV!=null) {
            if(CV.getContext)
            {
                ctx = CV.getContext("2d");
            }
        }
    } else {
        if (TheCanvas.getContext) {
            CV = TheCanvas;
            ctx = CV.getContext("2d");
        }
    }
    if (ctx == null) {
        this.isError = true;
        this.ErrMessage = "TheCanvas parameter is not a Canvas";
    } else {

        // get context
        this.Canvas = CV;
        this.Context = ctx;
        this.XSize = CV.clientWidth;
        this.YSize = CV.clientHeight;
        this.YLabel = YLabel;
        this.XLabel = XLabel;
        this.XPrecision = XAxisPrecision;
        this.YPrecision = YAxisPrecision;
        this.Title = Title;
        this.ControlBackColor = ContBackColor;
        this.GraphBackColor = GraphBackColor;
        this.GraphTop = 0;
        this.GraphBottom = 0;
        this.GraphHeight = 0;
        this.GraphLeft = 0;
        this.GraphRight = 0;
        this.GraphWidth = 0;
        this.GraphPadSize = 10;
        this.DrawGraph = function DrawGraph(XValues, YValues, LineColor) {
            ResetGraph(this);
            drawSingleLineGraph(this.Canvas, this.XSize, this.YSize, YValues, XValues, this.XLabel, this.YLabel, this.Title, this.ControlBackColor,LineColor, this.GraphBackColor)
        }
        
        // Seems like we are all done
        this.isError = false;

    }
}

function ResetGraph(MyG) {
    // calculate graph size
    MyG.GraphTop = MyG.YSize / MyG.GraphPadSize;
    MyG.GraphBottom = MyG.YSize - MyG.GraphTop;
    MyG.GraphHeight = MyG.GraphBottom - MyG.GraphTop;
    MyG.GraphLeft = (MyG.XSize / MyG.GraphPadSize) * 2;
    MyG.GraphRight = MyG.XSize - (MyG.XSize / MyG.GraphPadSize);
    MyG.GraphWidth = MyG.GraphRight - MyG.GraphLeft;
    // Draw Bounding Box
    MyG.Context.fillStyle = MyG.ControlBackColor;
    MyG.Context.fillRect(0, 0, MyG.XSize, MyG.YSize)
    MyG.Context.fillStyle = "black";
    MyG.Context.strokeRect(0, 0, MyG.XSize, MyG.YSize);
    MyG.Context.fillStyle = MyG.GraphBackColor;
    MyG.Context.fillRect(MyG.GraphLeft, MyG.GraphTop, MyG.GraphWidth, MyG.GraphHeight);
}

        
function drawSingleLineGraph(TheCanvas, XSize, YSize, YValues, XValues, XLabel, YLabel, Title, rgbContBack, LineColor, rgbGraphBack, GraphType) {
            
    var iserror = false;
    var errMessage = "";
    // check if canvas
    if (!TheCanvas.getContext) {
        iserror = true;
        errMessage = "TheCanvas parameter is not a Canvas";
    } else {
        // get context
        var ctx = TheCanvas.getContext("2d");
        // check if array DataXY
        if ((!YValues.length) || (!XValues.length)) {
            iserror = true;
            errMessage = "XValues and YValues parameters must be arrays";
        } else {
            // get number of DataXY vaslues
            var NumberOfYValueSets = 1;
            if (YValues[0].length) {
                NumberOfYValueSets = YValues.length;
                YValueN = YValues[0].length;
            } else {
                YValueN = YValues.length;
            }
            // check if xvalues is longer
            if (YValueN > XValues.length) {
                iserror = true;
                errMessage = "Number of X values does not match number of Y values";
            }
            else {

                // create array to hold local 
                var DataXY = new Array();
                for (var i = 0; i < NumberOfYValueSets; i++)
                    DataXY[i] = new Array(YValueN);

                // get Max Values
                var MaxY = FindMaxValue(YValues);
                var MinY = FindMinValue(YValues);
                var RangeY = MaxY - MinY;

                var MaxX = FindMaxValue(XValues);
                var MinX = FindMinValue(XValues);
                var RangeX = MaxX - MinX;
                // calculate Graph Y Size and Scale
                var GraphTop = YSize / 10;
                var GraphBottom = YSize - GraphTop;
                var GraphHeight = GraphBottom - GraphTop;
                var YScale = RangeY / GraphHeight;
                // calculate Graph X SIze and Scale
                var GraphLeft = (XSize / 10) * 2;
                var GraphRight = XSize - (XSize / 10);
                var GraphWidth = GraphRight - GraphLeft;
                var XScale = RangeX / GraphWidth;
                //  Fill DataXY Array with Graph XY values

                for (var j = 0; j < NumberOfYValueSets; j++) {
                    for (var i = 0; i < YValueN; i++) {
                        var px = ((XValues[i] - MinX) / XScale) + GraphLeft;
                        var py = 0;
                        if (NumberOfYValueSets == 0) {
                            py = GraphBottom - ((YValues[i] - MinY) / YScale);
                        } else {
                            py = GraphBottom - ((YValues[j][i] - MinY) / YScale);
                        }
                        DataXY[j][i] = new point(px, py);
                    }
                }
                // Draw Bounding Box
                //ctx.fillStyle = rgbContBack;
                //ctx.fillRect(0, 0, XSize, YSize)
                //ctx.fillStyle = "rgb(0,0,0)";
                //ctx.strokeRect(0, 0, XSize, YSize);
                //ctx.fillStyle = rgbGraphBack;
                //ctx.fillRect(GraphLeft, GraphTop, GraphWidth, GraphHeight);
                // Begin Drawing Lines
                ctx.fillStyle = "black";
                ctx.beginPath();
                // Draw X Axis
                ctx.moveTo(GraphLeft, GraphBottom)
                ctx.lineTo(GraphRight, GraphBottom)
                ctx.stroke();
                // Draw X Tics and Labels
                ctx.font = "10px Verdana";
                var XTicNumber = YValueN;
                if (YValueN > 10) {
                    XTicNumber = 10;
                }
                var YTicSize = (YSize - GraphBottom) / 10;
                var XInterval = FindInterval(MinX, MaxX, XTicNumber)
                var XTicSize = XInterval / XScale;
                var Ticx = GraphLeft
                for (var i = 0; i < XTicNumber; i++) {
                    // draw tic
                    ctx.moveTo(Ticx, GraphBottom)
                    ctx.lineTo(Ticx, GraphBottom + YTicSize);
                    ctx.stroke;
                    // Now Label
                    var Ticvalue = MinX+(Ticx - GraphLeft) * XScale;
                    var TicLabel = FormatNumber(Ticvalue, 0);
                    var Lw = ctx.measureText(TicLabel).width;
                    ctx.fillText(TicLabel, Ticx - (Lw / 2), GraphBottom + (YTicSize * 4))
                    // next tic
                    Ticx = Ticx + XTicSize;
                }
                // Draw Y Axis
                ctx.moveTo(GraphLeft, GraphTop)
                ctx.lineTo(GraphLeft, GraphBottom)
                ctx.stroke();
                var YTicNumber = 10;
                XTicSize = (GraphLeft) / 20;
                YTicSize = FindInterval(MinY, MaxY, YTicNumber) / YScale;
                var Ticy = GraphBottom
                for (var i = 0; i < YTicNumber; i++) {
                    ctx.moveTo(GraphLeft, Ticy)
                    ctx.lineTo(GraphLeft - XTicSize, Ticy);
                    // Now Label
                    Ticvalue = MinY+(((GraphHeight + GraphTop) - Ticy) * YScale);
                    TicLabel = FormatNumber(Ticvalue, 1);
                    var Lw = ctx.measureText(TicLabel).width;
                    ctx.fillText(TicLabel, (GraphLeft - (Lw + (2 * XTicSize))), Ticy)
                    // next tic
                    Ticy = Ticy - YTicSize;
                }
                ctx.stroke();
                ctx.closePath();
                // Ok create color array for data
                var DataLineColor = new Array();
                if (LineColor.length) {
                    for (var i = 0; i < LineColor.length; i++) {
                        DataLineColor[i] = LineColor[i];
                    }
                } else {
                    // OK only one color sent, draw all lines this color
                    for (var i = 0; i < LineColor.length; i++) {
                        DataLineColor[i] = LineColor;
                    }
                }
                // Draw DataXY DataX
                for (var j = 0; j < NumberOfYValueSets; j++) {
                    ctx.beginPath()
                    ctx.moveTo(DataXY[j][0].X, DataXY[j][0].Y);

                    for (var i = 1; i < DataXY[j].length; i++) {
                        ctx.lineTo(DataXY[j][i].X, DataXY[j][i].Y);
                    }
                    ctx.strokeStyle = DataLineColor[j]
                    ctx.stroke();
                    ctx.closePath();
                }

                // Label Graph
            } // XValue length <> YValueLength
        } // Not an array
            
        if (iserror) {
            ctx.font = "30px Verdana";
            ctx.fillText(errMessage, 0, 0);
        }
    } // not canvas

}
    // var ctx = MC.getContext('2d');
    // ctx.fillStyle = "rgb(255,255,255)";
    // ctx.fillRect(0, 0, 399, 399);
    // ctx.fillStyle = "rgb(0,0,0)";
    // ctx.strokeRect(0, 0, 399, 399);




