import React, { useState, useEffect } from "react";
import _ from 'underscore';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from "@material-ui/core/Button";
import simulateServer from './simulateServer';

export default function Upload({ files = [], clearFile, path }) {
    let [progress, setProgress] = useState(0);    
    let [open, setOpen] = useState(false);            

    useEffect(() => {        
        if (files.length > 0) {                                    
            setOpen(true);     
            simulateProgress()
        }                    
    }, [files.length, progress]);            

    let timeout;

    const simulateProgress = function(){               
                 
        timeout = setTimeout( ()=>{       
            if( progress < 100) {
                setProgress(progress + 1)                   
            }else{
                simulateServer.upload(files);                                                             
                clearTimeout(timeout);
                clearFile();
            }
        }, 10);  
        
    }

    return (
        <div className="upload">
            <Dialog
                open={open}
                fullWidth={true}
            >
                <DialogContent>
                    {
                        progress > 0 ? <div>
                            File Upload:
                            <LinearProgress variant="determinate" value={progress} />
                            <span className="percent">{progress} / 100%</span>
                        </div> : ""
                    }

                </DialogContent>
                <DialogActions>                    
                    {
                        progress === 100 ?
                            <Button onClick={evt => { 
                                setOpen(false) 
                                setProgress(0)
                            }} color="primary">
                                done
                        </Button> : ""
                    }
                </DialogActions>
            </Dialog>
        </div>
    )
}