/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useState } from "react";
import { useDropzone, DropzoneProps, FileError } from "react-dropzone";

import { Container, Content } from "./styles";

interface DropzoneDefaultProps extends DropzoneProps {
  isActive: string;
  isReject?: string;
  isAccept?: string;
  isLarge?: string;
}

function bytesToSize(bytes: number): string {
  const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i: number = parseInt(
    Math.floor(Math.log(bytes) / Math.log(1024)).toString()
  );
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

const DropZone: React.FC<DropzoneDefaultProps> = ({
  onDrop,
  isActive,
  isReject,
  isAccept,
  isLarge,
  maxSize,
  onDropAccepted,
  ...rest
}) => {
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const maxFileSize = maxSize ? maxSize : 0;

  const handleDropZone = useCallback(
    async (acceptedFiles: any, fileRejections: any) => {
      if (fileRejections.length > 0) {
        // Corrigido de 'lenght' para 'length'
        const rejectedFiles = fileRejections[0]
          .errors as unknown as FileError[];
        const checkFilesToLarge = rejectedFiles.find(
          (item) => item.code === "file-too-large"
        );

        if (checkFilesToLarge) {
          setIsFileTooLarge(true);
        }
      }
    },
    []
  );

  const maxFileSizeValidator = (file: File): FileError | FileError[] | null => {
    if (maxSize) {
      if (file.size > maxSize) {
        return {
          code: "file-too-large",
          message: `File is larger than ${maxSize} bytes`,
        };
      } else {
        return null;
      }
    }

    return null;
  };

  const handleDragEnter = useCallback(() => {
    setIsFileTooLarge(false);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    ...rest,
    onDrop: handleDropZone,
    onDropAccepted,
    validator: maxFileSizeValidator,
    onDragEnter: handleDragEnter,
  });

  const textLargeFile = isLarge ? isLarge : "File is too large.";

  return (
    <Container>
      <Content
        className={`${isDragReject && "reject"} ${isDragActive && "accept"} ${
          isFileTooLarge && "reject"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {isDragAccept && <p>{isAccept}</p>}
        {isDragReject && <p>{isReject}</p>}

        {!isFileTooLarge && <>{!isDragActive && <p>{isActive}</p>}</>}

        {isFileTooLarge && (
          <p>
            {textLargeFile} {bytesToSize(maxFileSize)}
          </p>
        )}
      </Content>
    </Container>
  );
};

export default DropZone;
