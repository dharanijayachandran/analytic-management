export class gatewayList {
    code: any;
    object: gatewayListObject[];
    id:number;
    name:string;
}
export class gatewayListObject{
    gatewayId:number;
    message:any;
    receivedTimestamp:any;
    gatewayName:string;
    dataServerTime:any;
    organizationId:number;
}