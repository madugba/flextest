
const grpcHandlers = {
    GetAdminInfo: (call, callback) => {
      const { adminId } = call.request;
  
      callback(null, { name: `Admin ${adminId}`, role: "Administrator" });
    },
  };
  

export default grpcHandlers;