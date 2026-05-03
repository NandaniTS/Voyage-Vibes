import { TCreatePackageRequest, TCreatePackageResponse, TGetAllPackageRequest, TGetAllPackageResponse, TGetByIdPackageRequest, TGetByIdPackageResponse, TUpdatePackageRequest, TUpdatePackageResponse } from "@repo/definitions";
import { IPackageDocument, PackageModel } from "../models";
import { BaseService } from "./base-service";
import { FilterQuery } from "mongoose";

class PackageService extends BaseService<IPackageDocument>{

    constructor() {
        super(PackageModel);
    }
    

    async create (data:TCreatePackageRequest):Promise<TCreatePackageResponse>{
      // console.log("data",data)
        try {

            const create_doc = await this.model.create(data);

            if(!create_doc){
                throw new Error("Error while creating package");
            }

            return create_doc as unknown as TCreatePackageResponse;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async update(data: TUpdatePackageRequest): Promise<TUpdatePackageResponse> {
        try {
          const require_doc = await this.model.findById(data._id);
          if (!require_doc) {
            throw new Error("Package not found");
          }
    
          const updatedDoc = await this.model.findByIdAndUpdate(data._id, data);
    
          if (updatedDoc) {
            return updatedDoc;
          } else {
            throw new Error("Error while updating package");
          }
        } catch (error) {
          throw error;
        }
      }


    async get_by_id(data:TGetByIdPackageRequest):Promise<TGetByIdPackageResponse>{

        try{


            const require_doc = await this.model.findById(data._id).lean();

            if(!require_doc){
                throw new Error("Package not found");
            }

            return require_doc;
        }catch(error){
            throw error
        }

    }

    async get_all(data:TGetAllPackageRequest):Promise<TGetAllPackageResponse>{

      try{

        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

        const filter: FilterQuery<IPackageDocument> = {
          "availableDates.startDate": { $gt: fiveDaysFromNow },
        };

        const results = await this.model.find(filter).lean();

        const totalItems = await this.model.countDocuments(filter);

        return {
          data:results,
          totalItems
        }

      }catch(error){
        throw error
      }

    }
}

export const packageService = new PackageService();
export default PackageService;