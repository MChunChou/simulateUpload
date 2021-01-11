import React, { useEffect, useState } from "react"
import FileDrop from 'react-file-drop'

import _ from 'underscore'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import UploadFile from './Upload.jsx';
import simulateServer from "./simulateServer.js";

function usePrevious(value) {
    const ref = React.useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function ListCard({ value, labelId, getFileList, handleCheck }) {
    let [checked, setChecked] = React.useState(false)
    const prevalue = usePrevious(value);

    useEffect(() => {        
        if (JSON.stringify(prevalue) !== JSON.stringify(value)) {
            setChecked(false)
        }
    }, [prevalue, value]);

    const handleDelete = _evt => {        
        // eslint-disable-next-line no-restricted-globals
        confirm(`Are you sure to delete files: \n ${value.name} `) &&
            simulateServer.deleteFile([value.name]) && getFileList()
    }

    const handleOnChange = _evt => {
        setChecked(!checked)
        handleCheck(!checked, value)
    }

    return (
        <ListItem role={undefined} className="list-card">
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    checked={checked}
                    onChange={handleOnChange}
                />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.name} />
            <ListItemSecondaryAction>
                {
                    value.is_dir ? "" :
                        <IconButton edge="end" onClick={handleDelete} className={"list-icon-button"}>
                            <DeleteIcon />
                        </IconButton>
                }
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default function Update() {
    let [files, setFiles] = useState([]);
    let [list, setList] = useState([]);
    let [check, setCheck] = useState([]);    

    useEffect(()=>{
        getFileList();   
    }, [files])
    

    let getFileList = () => {
        setList(simulateServer.getFileList());
    }

    let handleDrop = (files, evt) => {
        const tenM = 1048576;
        let uploadFiles = []
        _.each(files, (value, key) => {
            value.size > tenM? alert("The file size should less than 5 MB") :
            // check has file exist
            _.indexOf(list.map(v => v.name), value.name) > -1 ?
                // eslint-disable-next-line no-restricted-globals
                confirm(`Cover this file ${value.name}?`) 
                &&  uploadFiles.push(value) : uploadFiles.push(value)
        })

        setFiles(uploadFiles);
    }

    let handleDeleteAll = evt => {        
        check.length > 0 && 
        // eslint-disable-next-line no-restricted-globals
        confirm(`Are you sure to delete files: \n ${check.join("\n")} `) &&
        simulateServer.deleteFile(check); 
        getFileList();       
    }

    let handleUpload = evt => {
        let files = evt.target.files;
        handleDrop(files, evt);
    }

    let handleCheck = (checked, file) => {
        let { name } = file;
        let checkArr = Object.assign([], check);
        if(checked) {
            checkArr.push(name)
        }else{
            if(_.indexOf(checkArr, name) > -1){
                checkArr = _.without(checkArr, name)
            }
        }

        if (JSON.stringify(check) !== JSON.stringify(checkArr)) {
            setCheck(checkArr)
        }
    }

    return (
        <div className="update">            
            <FileDrop onDrop={handleDrop}>
                <div className="description">
                    This is <i>NOT</i> really upload system , file will delete when you close window
                    <p/>
                    Using button upload to add file or Drag file to page
                </div>
                <div className="control-bar">
                    <div className="control-btns">
                        <input type="file" id="file-upload" onChange={handleUpload} value={''}/>
                        <label htmlFor="file-upload">
                            <Button component="span" variant="contained" color="default" className="button">
                                upload
                        <CloudUploadIcon className="right-icon" />
                            </Button>
                        </label>
                        <Button variant="contained" color="default" className="button" onClick={handleDeleteAll}>
                            delete
                        <DeleteIcon className="right-icon" />
                        </Button>
                    </div>
                    <span>Files:</span>
                </div>
                <div className="list">
                    <List >                        
                        {list.map((value, index) => {
                            const labelId = `checkbox-list-label-${value}`;
                            if (!value.is_dir) {
                                return (
                                    <ListCard
                                        key={`${value}-${index}`}
                                        value={value}
                                        labelId={labelId}
                                        handleCheck={handleCheck}
                                        getFileList={getFileList}
                                    />
                                );
                            } else {
                                return ""
                            }
                        })}
                    </List>
                </div>
            </FileDrop>    
            <UploadFile 
                files={files}
                clearFile={ _ => {                        
                    getFileList();
                    setFiles([]);
                }}
                />
        </div> 
    )
};
