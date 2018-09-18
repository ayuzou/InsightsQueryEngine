export default class HtmlNode {

    private static HTML: string = 'html';
    private static BODY: string = 'body';
    private static DIV: string = 'div';
    private static SECTION: string = 'section';
    private static TABLE: string = 'table';
    private static ATTRS: string = 'attrs';
    private static CHILD_NODES: string = 'childNodes';
    private static NODE_NAME: string = 'nodeName';
    private static TEXT: string = '#text';
    private static A: string = 'a';
    private static TBODY: string = 'tbody';
    private static TR: string = 'tr';
    private static TD: string = 'td';

    static getInnerTextValue(node: any): string {
        const textNode = HtmlNode.getText(node);
        return textNode.value.trim();
    }

    static getInnerANodeTextNodeValue(node: any): string {
        const nodeA = HtmlNode.getA(node);
        return HtmlNode.getInnerTextValue(nodeA);
    }

    static getTBody(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.TBODY);
    }

    static getTableRows(table: any): Array<any> {
        const tbody: any = HtmlNode.getTBody(table);
        return HtmlNode.getChildNodesWithNodeName(tbody, HtmlNode.TR);
    }

    static getTableData(node: any): Array<any> {
        return HtmlNode.getChildNodesWithNodeName(node, HtmlNode.TD);
    }

    static getHtml(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.HTML);
    }

    static getBody(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.BODY);
    }

    static getSection(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.SECTION);
    }

    static getDiv(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.DIV);
    }

    static getTable(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.TABLE);
    }

    static getDivs(node: any): Array<any> {
        return HtmlNode.getChildNodesWithNodeName(node, HtmlNode.DIV);
    }

    static getMainDiv(divs: Array<any>) {
        return HtmlNode.findNodeWithAttribute(divs, 'id','main');
    }

    static getContent(divs: Array<any>) {
        return HtmlNode.findNodeWithAttribute(divs,'id','content');
    }

    static getViewContent(divs: Array<any>) {
        return HtmlNode.findNodeWithAttribute(divs, 'class','view-content');
    }

    static getViewFooter(divs: Array<any>) {
        return HtmlNode.findNodeWithAttribute(divs, 'class','view-footer');
    }

    static getText(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.TEXT);
    }

    static getA(node: any): any {
        return HtmlNode.getChildNode(node, HtmlNode.A);
    }

    static findNodeWithAttribute(nodes: Array<any>, attrName: string, attrValue: string) {
        for (let node of nodes) {
            if (node.hasOwnProperty(HtmlNode.ATTRS)) {
                for (let attr of node.attrs) {
                    if (attr.name === attrName && attr.value === attrValue) {
                        return node;
                    }
                }
            }
        }
        return null;
    }

    static getChildNodes(node: any): Array<any> {
        return (node !== null) && node.hasOwnProperty(HtmlNode.CHILD_NODES) ? node[HtmlNode.CHILD_NODES] : [];
    }

    static nodeNameEquals(node: any, nodeName: string) {
        return (node !== null) && node.hasOwnProperty(HtmlNode.NODE_NAME) ? node[HtmlNode.NODE_NAME] === nodeName : false;
    }

    // find the first child node
    static getChildNode(node: any, nodeName: string): any {
        const childNodes: Array<any> = HtmlNode.getChildNodes(node);
        for (let childNode of childNodes) {
            if (HtmlNode.nodeNameEquals(childNode, nodeName)) {
                return childNode;
            }
        }
        return null;
    }

    static getChildNodesWithNodeName(node: any, nodeName: string): Array<any> {
        let result: Array<any> = [];
        const childNodes: Array<any> = HtmlNode.getChildNodes(node);
        for (let childNode of childNodes) {
            if (HtmlNode.nodeNameEquals(childNode, nodeName)) {
                result.push(childNode);
            }
        }
        return result;
    }

}
