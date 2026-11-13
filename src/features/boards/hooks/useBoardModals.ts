import { useState } from 'react';
import { Id } from '../../../common/interfaces/common';
import { getChangedFields } from '../../../common/utils/objects';
import { useAppSelector } from '../../../app/hooks';
import { CreateListDto } from '../../lists/types/ListDtos';
import { CreateCardDto, NewCardTargetInfo, UpdateCardDto } from '../../cards/types/CardDtos';
import { BoardModalsProps } from '../components/BoardModals/BoardModals';

export interface BoardModalActions {
  createList: (dto: CreateListDto) => Promise<void>;
  deleteBoard: () => Promise<void>;
  deleteList: (id: Id) => Promise<void>;
  createCard: (dto: CreateCardDto) => Promise<void>;
  deleteCard: (id: Id) => Promise<void>;
  updateCard: (data: UpdateCardDto) => Promise<void>;
}

export interface UseBoardModalsReturn {
  openCreateListModal: () => void;
  openCreateCardModal: (info: NewCardTargetInfo) => void;
  openDeleteBoardModal: () => void;
  setListIdToDelete: (id: Id) => void;
  setCardIdToDelete: (id: Id) => void;
  isBoardDeleting: boolean;
  isListDeleting: boolean;
  isCardDeleting: boolean;
  modalProps: BoardModalsProps;
}

export function useBoardModals(board: BoardModalActions): UseBoardModalsReturn {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [newCardListInfo, setNewCardListInfo] = useState<NewCardTargetInfo | null>(null);

  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
  const [listIdToDelete, setListIdToDelete] = useState<Id>(Number.NaN);
  const [cardIdToDelete, setCardIdToDelete] = useState<Id>(Number.NaN);

  const [isBoardDeleting, setIsBoardDeleting] = useState(false);
  const [isListDeleting, setIsListDeleting] = useState(false);
  const [isCardDeleting, setIsCardDeleting] = useState(false);

  const updateCardInfo = useAppSelector((state) => state.currentCard.card);

  const handleDeleteBoard = async (): Promise<void> => {
    setIsBoardDeleting(true);
    try {
      await board.deleteBoard();
    } finally {
      setIsBoardDeleting(false);
    }
  };

  const handleDeleteList = async (): Promise<void> => {
    setIsListDeleting(true);
    try {
      await board.deleteList(listIdToDelete);
    } finally {
      setIsListDeleting(false);
    }
  };

  const handleDeleteCard = async (): Promise<void> => {
    setIsCardDeleting(true);
    try {
      await board.deleteCard(cardIdToDelete);
    } finally {
      setIsCardDeleting(false);
    }
  };

  const handleCreateList = async (data: CreateListDto): Promise<void> => {
    await board.createList(data);
  };

  const handleCreateCard = async (data: CreateCardDto): Promise<void> => {
    if (!newCardListInfo) return;
    await board.createCard({ ...data, ...newCardListInfo });
  };

  const handleUpdateCard = async (data: CreateCardDto): Promise<void> => {
    if (!updateCardInfo) return;
    const initialValues = {
      title: updateCardInfo.title ?? '',
      position: updateCardInfo.position ?? 0,
      list_id: updateCardInfo.list_id ?? '',
      description: updateCardInfo.description ?? '',
      custom: updateCardInfo.custom ?? { deadline: '' },
    };
    const changedFields = getChangedFields(initialValues, data);
    if (Object.keys(changedFields).length === 0) {
      return;
    }
    const updatePayload = {
      ...changedFields,
      id: updateCardInfo.id,
      list_id: updateCardInfo.list_id,
    };
    await board.updateCard(updatePayload);
  };

  return {
    openCreateListModal: (): void => setIsCreateListModalOpen(true),
    openCreateCardModal: (info: NewCardTargetInfo): void => setNewCardListInfo(info),
    openDeleteBoardModal: (): void => setIsDeleteBoardModalOpen(true),
    setListIdToDelete,
    setCardIdToDelete,
    isBoardDeleting,
    isListDeleting,
    isCardDeleting,
    modalProps: {
      isCreateListOpen: isCreateListModalOpen,
      onCloseCreateList: (): void => setIsCreateListModalOpen(false),
      onCreateList: handleCreateList,
      isCreateCardOpen: newCardListInfo !== null,
      onCloseCreateCard: (): void => setNewCardListInfo(null),
      onCreateCard: handleCreateCard,
      onUpdateCard: handleUpdateCard,
      isDeleteBoardOpen: isDeleteBoardModalOpen,
      onCloseDeleteBoard: (): void => setIsDeleteBoardModalOpen(false),
      onConfirmDeleteBoard: handleDeleteBoard,
      isDeleteBoardLoading: isBoardDeleting,
      isDeleteListOpen: !Number.isNaN(listIdToDelete),
      onCloseDeleteList: (): void => setListIdToDelete(Number.NaN),
      onConfirmDeleteList: handleDeleteList,
      isDeleteListLoading: isListDeleting,
      isDeleteCardOpen: !Number.isNaN(cardIdToDelete),
      onCloseDeleteCard: (): void => setCardIdToDelete(Number.NaN),
      onConfirmDeleteCard: handleDeleteCard,
      isDeleteCardLoading: isCardDeleting,
    },
  };
}
