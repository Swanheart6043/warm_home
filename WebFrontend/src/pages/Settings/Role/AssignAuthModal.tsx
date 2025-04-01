import { assignMenu, menuForAuth } from '@/API/SystemAPI';
import { treeify } from '@/util/treeify';
import type { TreeDataNode } from 'antd';
import { Modal, Tree, message } from 'antd';
import React, { useEffect, useState } from 'react';

type AssignAuthProps = {
  roleId?: number;
  tenantId?: number;
  onCancel: () => void;
  assignModalVisible: boolean;
};

type Key = string | number;

const handleAssign = async (roleId: number, menuIds: Key[]) => {
  const hide = message.loading('正在添加');
  try {
    const result = await assignMenu({ roleId, menuIds });
    hide();
    if (result.resp_code === 0) {
      message.success('权限分配成功');
      return true;
    } else {
      message.error(result.resp_msg);
      return false;
    }
  } catch (error) {
    hide();
    message.error('权限分配失败');
    return false;
  }
};

const AssignAuth: React.FC<AssignAuthProps> = (props) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [treeDataFlat, setTreeDataFlat] = useState<SYSTEM.Menu[]>([])
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const { roleId, tenantId } = props;

  useEffect(() => {
    (async () => {
      if (roleId && tenantId) {
        const menus = await menuForAuth(roleId, tenantId);
        setTreeDataFlat(menus)
        const arr: (SYSTEM.Menu & TreeDataNode & any)[] = menus.map((m) => {
          return { ...m, title: m.name, key: m.id };
        });
        const tree = treeify(arr, { parentId: 'pId' });
        setTreeData(tree);
        const noParentList: any[] = menus.filter((m) => m.checked).filter((m) => {
          const childrenCount = menus.reduce((previous, item) => item.pId === m.id ? ++previous : previous, 0)
          const childrenSelected = menus.reduce((previous, item) => item.pId === m.id && item.checked ? ++previous : previous, 0)
          return childrenSelected === childrenCount
        })
        const keys = noParentList.map((m) => m.id)
        setCheckedKeys(keys);
      }
    })();
  }, [roleId, tenantId]);

  const submit = async () => {
    if (!roleId) {
      console.log('roleId不能为空')
      return
    }
    const hasParentList: Key[] = checkedKeys.reduce<Key[]>((newList: Key[], id: Key) => {
      const parentList: Key[] = []
      const currentNode = treeDataFlat.filter(item => item.id).find(item => item.id === id)
      let pId = currentNode?.pId
      while(pId && pId !== -1) {
        const result = treeDataFlat.find(item => item.id === pId)
        if (result) parentList.push(result.id)
        pId = result?.pId
      }
      return [...newList, id, ...parentList]
    }, [])
    const success = await handleAssign(roleId, hasParentList);
    if (success) {
      setTreeData([])
      setCheckedKeys([])
      props.onCancel()
    }
  }

  const cancel = () => {
    setTreeData([])
    setCheckedKeys([])
    props.onCancel()
  }

  return (
    <Modal
      title="权限分配"
      open={props.assignModalVisible}
      destroyOnClose
      onOk={submit}
      onCancel={cancel}
    >
      <Tree
        defaultExpandAll
        checkable
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={(keys) => setCheckedKeys(Array.isArray(keys) ? keys : keys.checked)}
      />
    </Modal>
  );
};

export default AssignAuth;
