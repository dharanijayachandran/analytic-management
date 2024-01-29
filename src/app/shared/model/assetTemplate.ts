
export class AssetTemplate {
  id: number;
  name: string;
  organizationId: number;
  description: string;
  assetCategoryId: number;
  isTemplate: boolean;
  assetTemplateId: number;
  refAssetId: number;
  gateWayTemplateId: number;
  isGenanrateAssetTag: boolean;
  subAssets: AssetTemplate[];
  child: AssetTemplate[];
  createdBy: number;
  updatedBy: number;
  status: string;
  assetCategoryName: string;
  gatewayTemplateName: string;
  assetTemplateName: string;
  hasChild
}