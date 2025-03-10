import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import NoteItems from "./NoteItems";
import { FiFilePlus } from "react-icons/fi";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors";
//유저의 모든 노트들을 표시
const AllNotes = () => {
  const [notes, setNotes] = useState([]); //노트배열
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //유저의 노트들을 서버에서 가져옴
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");

      const parsedNotes = response.data.map((note) => ({
        ...note,
        parsedContent: JSON.parse(note.content).content, // 제이슨문자열을 변환해서 안의 내용만 가져옴
      }));
      setNotes(parsedNotes);
    } catch (error) {
      setError(error.response.data.message);
      console.error("노트 가져오기 에러", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //유저의 모든 노트 가져오기(처음 한번)
    fetchNotes();
  }, []);

  //에러나면 표시
  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="min-h-[calc(100vh-74px)] sm:py-10 sm:px-5 px-0 py-4">
      <div className="w-[92%] mx-auto ">
        {!loading && notes && notes?.length > 0 && (
          <h1 className="font-montserrat  text-slate-800 sm:text-4xl text-2xl font-semibold ">
            My Notes
          </h1>
        )}
        {loading ? (
          <div className="flex  flex-col justify-center items-center  h-72">
            <span>
              <Blocks
                height="70"
                width="70"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </span>
            <span>로딩중...</span>
          </div>
        ) : (
          <>
            {notes && notes?.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-96  p-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    아직 만든 노트가 없습니다.
                  </h2>
                  <p className="text-gray-600 mb-6">
                    당신의 생각을 노트로 표현해 보세요.
                  </p>
                  <div className="w-full flex justify-center">
                    <Link to="/create-note">
                      <button className="flex items-center px-4 py-2 bg-btnColor text-white rounded  focus:outline-none focus:ring-2 focus:ring-blue-300">
                        <FiFilePlus className="mr-2" size={24} />새 노트 작성
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="pt-10 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-10 gap-x-5 justify-center">
                  {notes.map((item) => (
                    <NoteItems key={item.id} {...item} id={item.id} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotes;
