import React from "react";

function ModalDetail({ title, data }) {
    return (
        <div>
            <div className="form-header">
                <h1>{title} 상세보기</h1>

                <div className="btns">
                    <div className="btn-close">
                        {/* Close button logic here */}
                    </div>
                </div>
            </div>

            <div className="RegistForm">
                <table className="formTable">
                    <tbody>
                    {
                        Object.entries(data).map(([key, dataValue]) => (
                            <tr key={key}>
                                <td>
                                    <div>{dataValue}</div>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ModalDetail;
