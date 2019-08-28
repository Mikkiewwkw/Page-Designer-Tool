import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ListGroup, ListGroupItem, Button, ProgressBar } from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import uniqueId from "lodash/uniqueId";

// async function getPresignedUploadUrl(bucketName, key) {
//     const url = await s3
//         .getSignedUrl("putObject", {
//             Bucket: bucketName,
//             Key: key,
//             ContentType: "image/*",
//             Expires: 300
//         })
//         .promise();
//     return url;
// }

const getColor = props => {
    if (props.isDragAccept) {
        return "#00e676";
    }
    if (props.isDragReject) {
        return "#ff1744";
    }
    if (props.isDragActive) {
        return "#2196f3";
    }
    return "#eeeeee";
};

const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16
};

const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box"
};

const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden"
};

const img = {
    display: "block",
    width: "auto",
    height: "100%"
};

function Dropzone(props) {
    const [files, setFiles] = useState([]);
    const [showRemove, setShowRemove] = useState(false);
    const [loaded, setLoaded] = useState(0);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject
    } = useDropzone({
        multiple: true,
        accept: "image/*",
        onDrop: acceptedFiles => {
            console.log(acceptedFiles);
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            );
            setShowRemove(true);
        }
    });

    //with inner or not? inner will shrink the size
    const thumbs = (
        <div style={thumbsContainer}>
            {files.map(file => (
                <CSSTransition key={file.path} timeout={500} classNames="item">
                    <div style={thumb} key={file.name}>
                        <div style={thumbInner}>
                            <img src={file.preview} alt="" style={img} />
                        </div>
                    </div>
                </CSSTransition>
            ))}
        </div>
    );

    // const thumbs = files.map(file => (
    //     <div style={thumb} key={file.name}>
    //         <img src={file.preview} style={img} />
    //     </div>
    // ));

    const removefile = name => () => {
        console.log("hi there");
        const newFiles = files.filter(item => item.name !== name);
        setFiles(newFiles);
        if (newFiles.length === 0) {
            setShowRemove(false);
        }
    };

    const removeAll = () => {
        setFiles([]);
        setShowRemove(false);
    };
    // var prefix = props.prefix;
    // console.log(typeof prefix);
    // prefix = prefix.substring(0, prefix.length - 1);
    // console.log("what is ", prefix);

    const uploadLogo = () => {
        const length = files.length;
        for (let i = 0; i < length; i++) {
            const formData = new FormData();
            //     console.log("look at me");
            //     formData.append(files[i].name, files[i]);
            // }
            formData.append("file", files[i]);
            console.log(formData);
            axios
                .post(`/image-upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    onUploadProgress: function(ProgressEvent) {
                        setLoaded(
                            (ProgressEvent.loaded / ProgressEvent.total) * 100
                        );
                    }
                })
                .then(response => {
                    // handle your response;
                    console.log("Get the response");
                    console.log(response);
                    toast.success("Upload successfully", { autoClose: 3000 });
                    setShowRemove(false);
                    setFiles([]);
                    setLoaded(0);
                })
                .catch(error => {
                    // handle your error
                    console.log(error);
                    toast.error("Upload fail");
                });
        }
    };

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    const acceptedFilesItems = (
        <ListGroup>
            {files.map(file => (
                <ListGroupItem key={uniqueId()}>
                    {file.path} - {file.size} bytes{" "}
                    <Button
                        size="sm"
                        className="remove-btn"
                        aria-label="Close"
                        variant="danger"
                        onClick={removefile(file.name)}
                        value={file.name}
                    >
                        &times;
                    </Button>
                </ListGroupItem>
            ))}
        </ListGroup>
    );

    // <em>(Only *.jpeg and *.png images will be accepted)</em>);
    const dragInActiveText = (
        <React.Fragment>
            <p>Drag and drop some files here, or click to select files</p>
            <em>(Only *.jpeg and *.png images will be accepted)</em>
        </React.Fragment>
    );
    const dragActiveText = <p>Drop it like hot</p>;
    const dragRejecttedText = <p>File type not accepted</p>;

    return (
        <div className="container col-md-12">
            <div
                {...getRootProps({
                    className: "dropzone"
                })}
            >
                <input {...getInputProps()} />
                {!isDragActive && dragInActiveText}
                {isDragActive && !isDragReject && dragActiveText}
                {isDragReject && dragRejecttedText}
            </div>
            <ProgressBar animated now={loaded} label={`${loaded}%`} />
            <ToastContainer />
            <aside>
                {thumbs}
                {acceptedFilesItems}
            </aside>
            {showRemove && (
                <Button
                    variant="danger"
                    className="remove-btn"
                    onClick={removeAll}
                >
                    Remove All
                </Button>
            )}
            {files.length > 0 && (
                <Button className="save-btn pull-right" onClick={uploadLogo}>
                    Save
                </Button>
            )}
        </div>
    );
}

export default Dropzone;
