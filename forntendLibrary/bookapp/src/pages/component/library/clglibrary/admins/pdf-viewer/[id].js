import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Userlayout from "@/u_layout";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

export default function PDFViewerPage({ fileUrl }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [renderingTask, setRenderingTask] = useState(null);
  const [viewportSize, setViewportSize] = useState(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    loadingTask.promise
      .then((loadedPdfDoc) => {
        setPdfDoc(loadedPdfDoc);
        loadFirstPage(loadedPdfDoc);
      })
      .catch((error) => {
        console.error("Error loading PDF document:", error);
      });

    return () => {
      if (renderingTask) {
        renderingTask.cancel();
      }
    };
  }, [fileUrl, loadFirstPage, renderingTask]);

  const loadFirstPage = useCallback((pdfDocument) => {
    pdfDocument.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1.0 });
      setViewportSize({ width: viewport.width, height: viewport.height });
      renderPage(1, pdfDocument, viewport.width, viewport.height);
    });
  }, [renderPage]);
  

  const renderPage = useCallback((pageNumber, pdfDocument, width, height) => {
    if (!pdfDocument) return;

    if (renderingTask) {
      renderingTask.cancel();
    }

    pdfDocument.getPage(pageNumber).then((page) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const scale = width / page.getViewport({ scale: 1 }).width;
      const viewport = page.getViewport({ scale });

      canvas.height = height;
      canvas.width = width;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      const task = page.render(renderContext);
      setRenderingTask(task);

      task.promise.catch((error) => {
        if (error.name !== "RenderingCancelledException") {
          console.error("Error rendering page:", error);
        }
      });
    });
  }, [renderingTask]);

  const handleNextPage = () => {
    if (currentPage < pdfDoc.numPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      renderPage(nextPage, pdfDoc, viewportSize.width, viewportSize.height);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      renderPage(prevPage, pdfDoc, viewportSize.width, viewportSize.height);
    }
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.navigation}>
        <button onClick={handlePrevPage} disabled={currentPage <= 1} style={styles.button}>
          Previous
        </button>
        <p style={styles.pageInfo}>
          Page {currentPage} of {pdfDoc?.numPages || "Loading..."}
        </p>
        <button onClick={handleNextPage} disabled={currentPage >= (pdfDoc?.numPages || 1)} style={styles.button}>
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  canvas: {
    maxWidth: "100%",
    border: "1px solid #ccc",
  },
  navigation: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  pageInfo: {
    fontSize: "16px",
    fontWeight: "bold",
  },
};

PDFViewerPage.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const res = await fetch(`http://localhost:8001/get-ebook/${id}`);
  const data = await res.json();

  return {
    fileUrl: `http://localhost:8001/${data.book.file}`,
  };
};

PDFViewerPage.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
