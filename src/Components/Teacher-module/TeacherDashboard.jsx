import React from 'react';
import '../../styles/teachers.css';
/**import '../../styles/teacherDashboard.css';**/
import sampleImage from '../../assets/GIFpic.jpg'; // Replace with the actual path to your image

const TeacherDashboard = () => {
    return (
        <div>
            {/* First Outer Box */}
            <div className="outer-box-version">
                <div className="inner-box-version">Version Update</div>
                <div className="tdcontainer">
                    <div className="title1">
                        <h2 className="title">Growing in Faith</h2>
                        <p className="description">
                            The Growing in Faith's stories is based on the textbook "Our Way to God." It will
                            feature different stories from the textbook, such as Daniel in the Lion's Den, Jesus Calms
                            the Storm, The Story of Creation, and many more. The game includes quizzes and quests
                            that progresses throughout the story, offering students an interactive way to utilize the
                            application. Students will embark on a journey through various specific story. In each story,
                            students will experience events in a form of quests that will reflect the spiritual lessons of
                            the story.
                        </p>
                        <button className="button">
                            <a href='https://drive.google.com/file/d/1wAUvzGf0-LokVhyKAbcze_H3wtZljt6D/view?usp=sharing'>Download v1.0</a>
                            </button>
                    </div>

                    <div className="title2">
                        <h2 className="title">Update Coming Soon</h2>
                        <p className="description1">The application is currently in the exciting stages of development, 
                            and we are working hard to bring you an engaging and interactive experience. Our team is dedicated to 
                            crafting captivating stories and challenging quizzes that will keep you entertained and informed. 
                            We appreciate your patience during this process, and we encourage you to stay tuned for more updates as we 
                            progress. There’s much more to come, and we can’t wait to share it with you!</p>
                    </div>
                </div>
            </div>

            {/* Second Outer Box */}
            <div className="outer-box-specification">
                <div className="inner-box-specification">Application Specification</div>
                <div className="spec-container">
                    <div className="image-container">
                        <img src={sampleImage} alt="Application preview" className="spec-image" />
                    </div>
                    <div className="spec-details">
                        <h2 className="title">Minimum Specification</h2>
                        <p className="spec-description">
                            <strong>Operating System:</strong> Android 8.0 ‘Oreo’ or higher version<br />
                            <strong>RAM:</strong> 8 GB or higher<br />
                            <strong>Storage:</strong> 64 GB or higher<br />
                            <strong>CPU:</strong> Qualcomm Snapdragon 680 or higher version
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;