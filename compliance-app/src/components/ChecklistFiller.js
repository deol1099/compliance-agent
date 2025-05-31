import React, { useEffect } from 'react';

function PdfViewer1() {
    useEffect(() => {
        const showPDF = () => {
            const adobeDCView = new window.AdobeDC.View({
                clientId: '6672adfcecbb42a3a38672ad3fd22df6', // Get it from Adobe Developer Console
                divId: 'adobe-dc-view',
            });

            adobeDCView.previewFile({
                content: {
                    location: {
                        url: `${window.location.origin}/AB-Checklist.pdf`,
                    },
                },
                metaData: { fileName: 'AB-Checklist.pdf' },
            }, {
                embedMode: 'FULL_WINDOW',
                showDownloadPDF: true,
                showPrintPDF: true,
            });
        };

        if (window.AdobeDC) showPDF();
        else document.addEventListener('adobe_dc_view_sdk.ready', showPDF);
    }, []);

    return <div id="adobe-dc-view" style={{ height: '100%', width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' ,  }} />;
}

export default PdfViewer1;
