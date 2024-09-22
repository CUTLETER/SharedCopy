import { useState } from 'react';

function useCheckboxManager2() {
    const [allCheck, setAllCheck] = useState(false);
    const [checkItem, setCheckItem] = useState({});
    const [showDelete, setShowDelete] = useState(false);

    const handleMasterCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setAllCheck(isChecked);

        // 전체 체크박스 상태에 따라 개별 체크박스 상태 업데이트
        const newCheckItem = {};
        for (let id in checkItem) {
            newCheckItem[id] = isChecked;
        }
        setCheckItem(newCheckItem);
        setShowDelete(isChecked && Object.keys(checkItem).length > 0);
    };

    const handleCheckboxChange = (e, id) => {
        const isChecked = e.target.checked;

        setCheckItem(prev => ({
            ...prev,
            [id]: isChecked
        }));

        const hasCheckedItems = Object.values({
            ...checkItem,
            [id]: isChecked
        }).some(checked => checked);

        setShowDelete(hasCheckedItems);

        if (!isChecked) {
            setAllCheck(false);
        }
    };

    const handleDelete = () => {
        const itemsToDelete = Object.keys(checkItem).filter(id => checkItem[id]);
        console.log("선택된 삭제 항목:", itemsToDelete);

        const newCheckItem = { ...checkItem };
        itemsToDelete.forEach(id => delete newCheckItem[id]);
        setCheckItem(newCheckItem);
        setAllCheck(false);
        setShowDelete(false);
    };

    return {
        allCheck,
        checkItem,
        showDelete,
        handleMasterCheckboxChange,
        handleCheckboxChange,
        handleDelete,
    };
}

export default useCheckboxManager2;