import { AssetTag } from "src/app/shared/model/assetTag";

export class AssetTagDetails {

    assetId: Number;
    startDate: string;
    endDate: string;
    targetTimeZone: string;
    assetTags: AssetTag[];
}
