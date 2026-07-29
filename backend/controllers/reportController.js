import ReportModel from "../models/reportModel.js";

const ReportController = {

    async getReport(req,res){

        try{

            const{

                start,

                end

            }=req.query;

            const report=

                await ReportModel.getReport(

                    start,

                    end

                );

            res.json(report);

        }

        catch(error){

            console.error(error);

            res.status(500).json({

                message:"Failed load report"

            });

        }

    }

};

export default ReportController;