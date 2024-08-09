// backend/models/SentencePair.js
const mongoose = require('mongoose');

const SentenceSchema = new mongoose.Schema({
    task: { type: mongoose.Types.ObjectId, ref: 'Task' },
    index: {
        type: String,
        required: true
    },
    english: {
        type: String,
        required: true
    },
    hindi: {
        type: String,
        required: true
    },
    incorrect_word_choice: {
        type: String,
        // required: true
    },
    tense_error: {
        type: String,
    },
    gnp_error: {
        type: String,
    },
    contextual_error: {
        type: String,
    },
    tone: {
        type: String,
    },
    voice_error: {
        type: String,
    },
    punctuation: {
        type: String,
    },
    addition: {
        type: String,
    },
    omission: {
        type: String,
    },
    rentention: {
        type: String,
    },
    unnatural: {
        type: String,
    },
    spelling_typological: {
        type: String,
    },
    ne: {
        type: String,
    },
    inconsistency: {
        type: String,
    },
    mistranslation: {
        type: String,
    },
    part_of_speech: {
        type: String,
    },
    function_words: {
        type: String,
    },
    fluency: {
        type: String,
    },
    coherence: {
        type: String,
    },
    connectives: {
        type: String,
    },
    terminology: {
        type: String,
    },
    done: {
        type: Boolean,
        default: false
    },
    selectedNumber: Number,
    status: { type: String, default: 'not_attempted' }
});

const SentencePairModel = mongoose.model('SentencePair', SentenceSchema);

module.exports = SentencePairModel;
