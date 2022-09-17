const { User, Thought } = require('../models');

const thoughtController = {

    //GET ALL Thoughts
     getAllThoughts(req,res) {
            //find all thoughts
            Thought.find({})
            .select('-__v')
            .then(dbThoughtData => {res.json(dbThoughtData)})
            .catch(err => res.status(404).json(err))
        
    },
    getThoughtById({ params }, res) {
        Thought.findOne({_id: params.thoughtId})
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought was found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
    //create thought
    createThought({ body }, res) {
        Thought.create(body)
        .then((thought) => {
             return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: thought }},
                { new: true, runValidators: true }
            );
        })
        .then((dbThoughtData) => {
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

     //create reaction
     createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
            })
            .catch(err => res.json(err))
        },

    //find thought and update
    updateThought({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId}, 
        body,
        { new: true, runValidators: true }) 
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err)); 
    },

    //DELETE /api/thoughts/:id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!'});
                return;
            }
            return User.findOneAndUpdate(
                { thoughts: params.thoughtId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            )
        })
        .then(() => res.json({ message: 'Thought has been deleted!'}))
        .catch(err => res.status(400).json(err));
        },
        
        // Deleting friend from friend's list 
        removeReaction({ params }, res) {
            Thought.findOneAndUpdate(
                { _id: params.thoughtId }, 
                { $pull: { reactions: { reactionId: params.reactionId }}},
                { new: true }
            )
            .then(dbThoughtData => res.json(dbThoughtData))
			.catch(err => res.json(err));

}
};


//exporting controller
module.exports = thoughtController;
