import _ from 'underscore'

const simulateServer = {
    db: {
        files: [new File(["this is first file"], "showfirstFile.txt", {
            type: "text/plain",
        })],
    },
    upload: (files) => {                

        _.each(files, (file)=>{ 
            simulateServer.deleteFile([file.name])                       
            simulateServer.db.files.push(
                file
            )
        })        

        return true
    },
    getFileList: () => {        
        return simulateServer.db.files.map(element => {            
            return {name: element.name}
        });
    },    
    deleteFile: (files) => {         
        _.each(files, f => {
            let index = _.findIndex(simulateServer.db.files, {name: f} );
            if(index > -1){
                simulateServer.db.files.splice(index, 1);
            }            
        })        
            
        return true
    }
}

export default simulateServer;
