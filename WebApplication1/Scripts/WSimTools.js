/*****************************************
WaterSim JavaScript Support Tools, Object, and Functions
CopyRight 2014
Keeper Ray Quay
Version 1.0   1/21/14
*****************************************/

function ModelInputs(ArrayOfFieldObjects) {
    this.Inputs = ArrayOfFieldObjects;
}

// Creates Base Input Object - fieldname is string, value is int
function BaseInputField(fieldname, value) {
    this.FLD = fieldname;
    this.VAL = value;
}

// Creates Provider Input Object - fieldname is string, value is int, providecode is string
function ProviderInputField(Fieldname, value, providercode) {
    this.FLD = fieldname;
    this.VAL = value;
    this.PVC = providercode;
}

function WS_Control(TheInputControl, InputField, GetValue, SetValue) {
    this.TheInputControl = TheInputControl;
    this.InputField = InputField;
    this.GetValue = GetValue;
    this.SetValue = SetValue;
}

function GetValueTemplate() {
    return 0; // return an int
}

function SetValueTemplate(value) {
    controlvalue = value // set a control value
}

function WS_Controls_Class() {
    this.Controls = new Array();
    this.Add = function (Control_Object) { this.Controls[this.Controls.length]= Control_Object; }
    this.Length = function () { return this.Controls.length; }
    this.FindByID = function (theid) { }; // returns single WSControl_Object
    this.FindByFieldname = function (Fieldname) { }; // returns array of WS_Control Obects
    this.FieldObject = function (index) {
        var temp = null;
        if ((index > -1) && (index < this.Controls.length))
            temp = this.Controls[index].InputField;
        return temp;
    }
    this.Control = function (index) {
        var temp = null;
        if ((index > -1) && (index < this.Controls.length))
            temp = this.Controls[index];
        return temp;
    }
}


function isProvider(InputField) {
    return (InputField.PVC != null);
}

var WS_Controls = new WS_Controls_Class();

function GetInputFieldObject() {
    var InputFieldArray = new Array();
    var count = WS_Controls.Length();
    for (var i = 0; i < count; i++) {
        var FieldObject = WS_Controls.FieldObject(i);
        var FieldControl = WS_Controls.Control(i);
        var value = FieldControl.GetValue();
        FieldObject.VAL = value;
        InputFieldArray[i] = FieldObject;
    }
    InObject = new ModelInputs(InputFieldArray);
    return InObject;
}

function AjaxXMLToObject(TheAjaxXML) {
    // Ok here is what is going on
    // First, use JQuery to load the xml into a XMLDocument type
    var xmlDoc = $.parseXML(TheAjaxXML);
    // Now grab the first element/Node, which should be a <STRING></STRING> XML node
    var StringNode = xmlDoc.documentElement;
    // OK get just the content of the <STRING></STRING> XML node
    var RealString = StringNode.textContent;  // Not that Stupid XML Coding!
    // OK now I should have the JSON text description, use JSON to parse it
    MyJSObject = JSON.parse(RealString);
    // Viola! A Javascript object
    return MyJSObject;
    // It took me forever to figure this out, never could find a "solution" using google
}
