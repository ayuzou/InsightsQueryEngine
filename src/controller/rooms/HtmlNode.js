"use strict";
var HtmlNode = (function () {
    function HtmlNode() {
    }
    HtmlNode.getInnerTextValue = function (node) {
        var textNode = HtmlNode.getText(node);
        return textNode.value.trim();
    };
    HtmlNode.getInnerANodeTextNodeValue = function (node) {
        var nodeA = HtmlNode.getA(node);
        return HtmlNode.getInnerTextValue(nodeA);
    };
    HtmlNode.getTBody = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.TBODY);
    };
    HtmlNode.getTableRows = function (table) {
        var tbody = HtmlNode.getTBody(table);
        return HtmlNode.getChildNodesWithNodeName(tbody, HtmlNode.TR);
    };
    HtmlNode.getTableData = function (node) {
        return HtmlNode.getChildNodesWithNodeName(node, HtmlNode.TD);
    };
    HtmlNode.getHtml = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.HTML);
    };
    HtmlNode.getBody = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.BODY);
    };
    HtmlNode.getSection = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.SECTION);
    };
    HtmlNode.getDiv = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.DIV);
    };
    HtmlNode.getTable = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.TABLE);
    };
    HtmlNode.getDivs = function (node) {
        return HtmlNode.getChildNodesWithNodeName(node, HtmlNode.DIV);
    };
    HtmlNode.getMainDiv = function (divs) {
        return HtmlNode.findNodeWithAttribute(divs, 'id', 'main');
    };
    HtmlNode.getContent = function (divs) {
        return HtmlNode.findNodeWithAttribute(divs, 'id', 'content');
    };
    HtmlNode.getViewContent = function (divs) {
        return HtmlNode.findNodeWithAttribute(divs, 'class', 'view-content');
    };
    HtmlNode.getViewFooter = function (divs) {
        return HtmlNode.findNodeWithAttribute(divs, 'class', 'view-footer');
    };
    HtmlNode.getText = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.TEXT);
    };
    HtmlNode.getA = function (node) {
        return HtmlNode.getChildNode(node, HtmlNode.A);
    };
    HtmlNode.findNodeWithAttribute = function (nodes, attrName, attrValue) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node.hasOwnProperty(HtmlNode.ATTRS)) {
                for (var _a = 0, _b = node.attrs; _a < _b.length; _a++) {
                    var attr = _b[_a];
                    if (attr.name === attrName && attr.value === attrValue) {
                        return node;
                    }
                }
            }
        }
        return null;
    };
    HtmlNode.getChildNodes = function (node) {
        return (node !== null) && node.hasOwnProperty(HtmlNode.CHILD_NODES) ? node[HtmlNode.CHILD_NODES] : [];
    };
    HtmlNode.nodeNameEquals = function (node, nodeName) {
        return (node !== null) && node.hasOwnProperty(HtmlNode.NODE_NAME) ? node[HtmlNode.NODE_NAME] === nodeName : false;
    };
    HtmlNode.getChildNode = function (node, nodeName) {
        var childNodes = HtmlNode.getChildNodes(node);
        for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
            var childNode = childNodes_1[_i];
            if (HtmlNode.nodeNameEquals(childNode, nodeName)) {
                return childNode;
            }
        }
        return null;
    };
    HtmlNode.getChildNodesWithNodeName = function (node, nodeName) {
        var result = [];
        var childNodes = HtmlNode.getChildNodes(node);
        for (var _i = 0, childNodes_2 = childNodes; _i < childNodes_2.length; _i++) {
            var childNode = childNodes_2[_i];
            if (HtmlNode.nodeNameEquals(childNode, nodeName)) {
                result.push(childNode);
            }
        }
        return result;
    };
    return HtmlNode;
}());
HtmlNode.HTML = 'html';
HtmlNode.BODY = 'body';
HtmlNode.DIV = 'div';
HtmlNode.SECTION = 'section';
HtmlNode.TABLE = 'table';
HtmlNode.ATTRS = 'attrs';
HtmlNode.CHILD_NODES = 'childNodes';
HtmlNode.NODE_NAME = 'nodeName';
HtmlNode.TEXT = '#text';
HtmlNode.A = 'a';
HtmlNode.TBODY = 'tbody';
HtmlNode.TR = 'tr';
HtmlNode.TD = 'td';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HtmlNode;
//# sourceMappingURL=HtmlNode.js.map