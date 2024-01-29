export class FramedDataPacket{
    gatewayId:number;
    gatewayName:String;
    nodeIODHId:number;
    message:String;
    receivedTimestamp:String;
}

export class RawDataReport{
    gatewayId: number;
      startDate: string;
      endDate: string;
      startTime: string
      endTime: string
  }